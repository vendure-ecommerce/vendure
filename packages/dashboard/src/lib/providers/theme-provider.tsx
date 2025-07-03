import { createContext, useEffect } from 'react';
import { useUserSettings } from '../hooks/use-user-settings.js';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, defaultTheme = 'system', ...props }: Readonly<ThemeProviderProps>) {
    const { settings, setTheme } = useUserSettings();

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (settings.theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(settings.theme);
    }, [settings.theme]);

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={{
                theme: settings.theme,
                setTheme: setTheme,
            }}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}
