import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { ColumnFiltersState } from '@tanstack/react-table';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { api } from '../graphql/api.js';
import {
    getSettingsStoreValueDocument,
    setSettingsStoreValueDocument,
} from '../graphql/settings-store-operations.js';
import { Theme } from './theme-provider.js';

export interface TableSettings {
    columnVisibility?: Record<string, boolean>;
    columnOrder?: string[];
    columnFilters?: ColumnFiltersState;
    pageSize?: number;
}

export interface UserSettings {
    displayLanguage: string;
    displayLocale?: string;
    contentLanguage: string;
    theme: Theme;
    displayUiExtensionPoints: boolean;
    mainNavExpanded: boolean;
    activeChannelId: string;
    devMode: boolean;
    hasSeenOnboarding: boolean;
    tableSettings?: Record<string, TableSettings>;
}

const defaultSettings: UserSettings = {
    displayLanguage: 'en',
    displayLocale: undefined,
    contentLanguage: 'en',
    theme: 'system',
    displayUiExtensionPoints: false,
    mainNavExpanded: true,
    activeChannelId: '',
    devMode: false,
    hasSeenOnboarding: false,
    tableSettings: {},
};

export interface UserSettingsContextType {
    settings: UserSettings;
    setDisplayLanguage: (language: string) => void;
    setDisplayLocale: (locale: string | undefined) => void;
    setContentLanguage: (language: string) => void;
    setTheme: (theme: Theme) => void;
    setDisplayUiExtensionPoints: (display: boolean) => void;
    setMainNavExpanded: (expanded: boolean) => void;
    setActiveChannelId: (channelId: string) => void;
    setDevMode: (devMode: boolean) => void;
    setHasSeenOnboarding: (hasSeen: boolean) => void;
    setTableSettings: <K extends keyof TableSettings>(
        tableId: string,
        key: K,
        value: TableSettings[K],
    ) => void;
}

export const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'vendure-user-settings';
const SETTINGS_STORE_KEY = 'vendure.dashboard.userSettings';

interface UserSettingsProviderProps {
    queryClient?: QueryClient;
    children: React.ReactNode;
}

export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({ queryClient, children }) => {
    // Load settings from localStorage or use defaults
    const loadSettings = (): UserSettings => {
        try {
            const storedSettings = localStorage.getItem(STORAGE_KEY);
            if (storedSettings) {
                return { ...defaultSettings, ...JSON.parse(storedSettings) };
            }
        } catch (e) {
            console.error('Failed to load user settings from localStorage', e);
        }
        return { ...defaultSettings };
    };

    const [settings, setSettings] = useState<UserSettings>(loadSettings);
    const [serverSettings, setServerSettings] = useState<UserSettings | null>(null);
    const [isReady, setIsReady] = useState(false);
    const previousContentLanguage = useRef(settings.contentLanguage);

    // Load settings from server on mount
    const { data: serverSettingsResponse, isSuccess: serverSettingsLoaded } = useQuery({
        queryKey: ['user-settings', SETTINGS_STORE_KEY],
        queryFn: () => api.query(getSettingsStoreValueDocument, { key: SETTINGS_STORE_KEY }),
        retry: false,
        staleTime: 0,
    });

    // Mutation to save settings to server
    const saveToServerMutation = useMutation({
        mutationFn: (settingsToSave: UserSettings) =>
            api.mutate(setSettingsStoreValueDocument, {
                input: { key: SETTINGS_STORE_KEY, value: settingsToSave },
            }),
        onError: error => {
            console.error('Failed to save user settings to server:', error);
        },
    });

    // Initialize settings from server if available
    useEffect(() => {
        if (serverSettingsLoaded && !isReady) {
            try {
                const serverSettingsData =
                    serverSettingsResponse?.getSettingsStoreValue as UserSettings | null;
                if (serverSettingsData) {
                    // Server has settings, use them
                    const mergedSettings = { ...defaultSettings, ...serverSettingsData };
                    setSettings(mergedSettings);
                    setServerSettings(mergedSettings);
                    setIsReady(true);
                }
            } catch (e) {
                console.error('Failed to parse server settings:', e);
                setServerSettings(settings);
                setIsReady(true);
            }
        }
    }, [serverSettingsLoaded, serverSettingsResponse, settings, isReady]);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save user settings to localStorage', e);
        }
    }, [settings]);

    // Save to server when settings differ from server state
    useEffect(() => {
        if (isReady && serverSettings) {
            const serverDiffers = JSON.stringify(serverSettings) !== JSON.stringify(settings);

            if (serverDiffers) {
                saveToServerMutation.mutate(settings);
                setServerSettings(settings);
            }
        }
    }, [settings, serverSettings, isReady, saveToServerMutation]);

    // Invalidate all queries when content language changes
    useEffect(() => {
        if (queryClient && settings.contentLanguage !== previousContentLanguage.current) {
            void queryClient.invalidateQueries();
            previousContentLanguage.current = settings.contentLanguage;
        }
    }, [settings.contentLanguage, queryClient]);

    // Settings updaters
    const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const contextValue: UserSettingsContextType = {
        settings,
        setDisplayLanguage: language => updateSetting('displayLanguage', language),
        setDisplayLocale: locale => updateSetting('displayLocale', locale),
        setContentLanguage: language => updateSetting('contentLanguage', language),
        setTheme: theme => updateSetting('theme', theme),
        setDisplayUiExtensionPoints: display => updateSetting('displayUiExtensionPoints', display),
        setMainNavExpanded: expanded => updateSetting('mainNavExpanded', expanded),
        setActiveChannelId: channelId => updateSetting('activeChannelId', channelId),
        setDevMode: devMode => updateSetting('devMode', devMode),
        setHasSeenOnboarding: hasSeen => updateSetting('hasSeenOnboarding', hasSeen),
        setTableSettings: (tableId, key, value) => {
            setSettings(prev => ({
                ...prev,
                tableSettings: {
                    ...prev.tableSettings,
                    [tableId]: { ...(prev.tableSettings?.[tableId] || {}), [key]: value },
                },
            }));
        },
    };

    return <UserSettingsContext.Provider value={contextValue}>{children}</UserSettingsContext.Provider>;
};
