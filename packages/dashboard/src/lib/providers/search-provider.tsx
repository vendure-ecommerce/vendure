import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface SearchResult {
    id: string;
    type: SearchResultType | string; // Allow both enum and string for flexibility
    title: string;
    subtitle?: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    metadata?: Record<string, any>;
    relevanceScore?: number;
    lastModified?: string;
}

export enum SearchResultType {
    // Core Entities
    PRODUCT = 'PRODUCT',
    PRODUCT_VARIANT = 'PRODUCT_VARIANT',
    CUSTOMER = 'CUSTOMER',
    ORDER = 'ORDER',
    COLLECTION = 'COLLECTION',
    ADMINISTRATOR = 'ADMINISTRATOR',
    CHANNEL = 'CHANNEL',
    ASSET = 'ASSET',
    FACET = 'FACET',
    FACET_VALUE = 'FACET_VALUE',
    PROMOTION = 'PROMOTION',
    PAYMENT_METHOD = 'PAYMENT_METHOD',
    SHIPPING_METHOD = 'SHIPPING_METHOD',
    TAX_CATEGORY = 'TAX_CATEGORY',
    TAX_RATE = 'TAX_RATE',
    COUNTRY = 'COUNTRY',
    ZONE = 'ZONE',
    ROLE = 'ROLE',
    CUSTOMER_GROUP = 'CUSTOMER_GROUP',
    STOCK_LOCATION = 'STOCK_LOCATION',
    TAG = 'TAG',

    // Custom/Plugin Entities
    CUSTOM_ENTITY = 'CUSTOM_ENTITY',

    // Dashboard Content
    NAVIGATION = 'NAVIGATION',
    SETTINGS = 'SETTINGS',
    QUICK_ACTION = 'QUICK_ACTION',

    // External Content
    DOCUMENTATION = 'DOCUMENTATION',
    BLOG_POST = 'BLOG_POST',
    PLUGIN = 'PLUGIN',
    WEBSITE_CONTENT = 'WEBSITE_CONTENT',
}

export interface QuickAction {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    shortcut?: string;
    isContextAware: boolean;
    requiredPermissions?: string[];
    handler: QuickActionHandler;
    params?: Record<string, any>;
}

export type QuickActionHandler = (context: QuickActionContext) => void | Promise<void>;

export interface QuickActionContext {
    currentRoute: string;
    currentEntityType?: string;
    currentEntityId?: string;
    navigate: (path: string) => void;
    showNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
    confirm: (message: string) => Promise<boolean>;
    executeGraphQL: (query: string, variables?: any) => Promise<any>;
}

interface SearchContextType {
    // Command palette state
    isCommandPaletteOpen: boolean;
    setIsCommandPaletteOpen: (open: boolean) => void;
    
    // Search state
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: SearchResult[];
    setSearchResults: (results: SearchResult[]) => void;
    isSearching: boolean;
    setIsSearching: (searching: boolean) => void;
    
    // Search filters
    selectedTypes: SearchResultType[];
    setSelectedTypes: (types: SearchResultType[]) => void;
    
    // Quick actions
    quickActions: QuickAction[];
    registerQuickAction: (action: QuickAction) => void;
    unregisterQuickAction: (actionId: string) => void;
    
    // Recent searches
    recentSearches: string[];
    addRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    // Command palette state
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<SearchResultType[]>([]);
    
    // Quick actions
    const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
    
    // Recent searches (stored in localStorage)
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem('vendure-search-history');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const registerQuickAction = useCallback((action: QuickAction) => {
        setQuickActions(prev => {
            const existing = prev.find(a => a.id === action.id);
            if (existing) {
                // Replace existing action
                return prev.map(a => a.id === action.id ? action : a);
            }
            return [...prev, action];
        });
    }, []);

    const unregisterQuickAction = useCallback((actionId: string) => {
        setQuickActions(prev => prev.filter(a => a.id !== actionId));
    }, []);

    const addRecentSearch = useCallback((query: string) => {
        if (!query.trim() || query.length < 2) return;
        
        setRecentSearches(prev => {
            const filtered = prev.filter(q => q !== query);
            const updated = [query, ...filtered].slice(0, 10); // Keep last 10 searches
            localStorage.setItem('vendure-search-history', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem('vendure-search-history');
    }, []);

    return (
        <SearchContext.Provider 
            value={{
                isCommandPaletteOpen,
                setIsCommandPaletteOpen,
                searchQuery,
                setSearchQuery,
                searchResults,
                setSearchResults,
                isSearching,
                setIsSearching,
                selectedTypes,
                setSelectedTypes,
                quickActions,
                registerQuickAction,
                unregisterQuickAction,
                recentSearches,
                addRecentSearch,
                clearRecentSearches,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within SearchProvider');
    }
    return context;
};