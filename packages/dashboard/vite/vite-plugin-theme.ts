import { Plugin } from 'vite';

type ThemeColors = {
    background?: string;
    foreground?: string;
    card?: string;
    'card-foreground'?: string;
    popover?: string;
    'popover-foreground'?: string;
    primary?: string;
    'primary-foreground'?: string;
    secondary?: string;
    'secondary-foreground'?: string;
    muted?: string;
    'muted-foreground'?: string;
    accent?: string;
    'accent-foreground'?: string;
    destructive?: string;
    'destructive-foreground'?: string;
    success?: string;
    'success-foreground'?: string;
    'dev-mode'?: string;
    'dev-mode-foreground'?: string;
    border?: string;
    input?: string;
    ring?: string;
    'chart-1'?: string;
    'chart-2'?: string;
    'chart-3'?: string;
    'chart-4'?: string;
    'chart-5'?: string;
    radius?: string;
    sidebar?: string;
    'sidebar-foreground'?: string;
    'sidebar-primary'?: string;
    'sidebar-primary-foreground'?: string;
    'sidebar-accent'?: string;
    'sidebar-accent-foreground'?: string;
    'sidebar-border'?: string;
    'sidebar-ring'?: string;
    brand?: string;
    'brand-lighter'?: string;
    'brand-darker'?: string;
    'font-sans'?: string;
    'font-mono'?: string;
    [key: string]: string | undefined;
};

export interface ThemeVariables {
    light?: ThemeColors;
    dark?: ThemeColors;
}

const defaultVariables: ThemeVariables = {
    light: {
        background: 'oklch(1.0000 0 0)',
        foreground: 'oklch(0.2103 0.0059 285.8852)',
        card: 'oklch(1.0000 0 0)',
        'card-foreground': 'oklch(0.2103 0.0059 285.8852)',
        popover: 'oklch(1.0000 0 0)',
        'popover-foreground': 'oklch(0.2103 0.0059 285.8852)',
        primary: 'oklch(0.7613 0.1503 231.1314)',
        'primary-foreground': 'oklch(0.1408 0.0044 285.8229)',
        secondary: 'oklch(0.9674 0.0013 286.3752)',
        'secondary-foreground': 'oklch(0.2103 0.0059 285.8852)',
        muted: 'oklch(0.9674 0.0013 286.3752)',
        'muted-foreground': 'oklch(0.5517 0.0138 285.9385)',
        accent: 'oklch(0.9674 0.0013 286.3752)',
        'accent-foreground': 'oklch(0.2103 0.0059 285.8852)',
        destructive: 'oklch(0.5771 0.2152 27.3250)',
        'destructive-foreground': 'oklch(0.9851 0 0)',
        success: 'hsl(100, 81%, 35%)',
        'success-foreground': 'hsl(0 0% 98%)',
        'dev-mode': 'hsl(204, 76%, 62%)',
        'dev-mode-foreground': 'hsl(0 0% 98%)',
        border: 'oklch(0.9197 0.0040 286.3202)',
        input: 'oklch(0.9197 0.0040 286.3202)',
        ring: 'oklch(0.7613 0.1503 231.1314)',
        'chart-1': 'oklch(0.7613 0.1503 231.1314)',
        'chart-2': 'oklch(0.5575 0.2525 302.3212)',
        'chart-3': 'oklch(0.5858 0.2220 17.5846)',
        'chart-4': 'oklch(0.6658 0.1574 58.3183)',
        'chart-5': 'oklch(0.6271 0.1699 149.2138)',
        radius: '0.375rem',
        sidebar: 'oklch(0.9674 0.0013 286.3752)',
        'sidebar-foreground': 'oklch(0.2103 0.0059 285.8852)',
        'sidebar-primary': 'oklch(0.7613 0.1503 231.1314)',
        'sidebar-primary-foreground': 'oklch(0.1408 0.0044 285.8229)',
        'sidebar-accent': 'oklch(1.0000 0 0)',
        'sidebar-accent-foreground': 'oklch(0.2103 0.0059 285.8852)',
        'sidebar-border': 'oklch(0.9197 0.0040 286.3202)',
        'sidebar-ring': 'oklch(0.7613 0.1503 231.1314)',
        brand: '#17c1ff',
        'brand-lighter': '#e6f9ff',
        'brand-darker': '#0099ff',
        'font-sans': 'Inter, sans-serif',
        'font-mono': 'Geist Mono, monospace',
    },
    dark: {
        background: 'oklch(0.1408 0.0044 285.8229)',
        foreground: 'oklch(0.9851 0 0)',
        card: 'oklch(0.2103 0.0059 285.8852)',
        'card-foreground': 'oklch(0.9851 0 0)',
        popover: 'oklch(0.2103 0.0059 285.8852)',
        'popover-foreground': 'oklch(0.9851 0 0)',
        primary: 'oklch(0.7613 0.1503 231.1314)',
        'primary-foreground': 'oklch(0.1408 0.0044 285.8229)',
        secondary: 'oklch(0.2739 0.0055 286.0326)',
        'secondary-foreground': 'oklch(0.9851 0 0)',
        muted: 'oklch(0.2739 0.0055 286.0326)',
        'muted-foreground': 'oklch(0.7118 0.0129 286.0665)',
        accent: 'oklch(0.2739 0.0055 286.0326)',
        'accent-foreground': 'oklch(0.9851 0 0)',
        destructive: 'oklch(0.6368 0.2078 25.3313)',
        'destructive-foreground': 'oklch(0.9851 0 0)',
        success: 'hsl(100, 100%, 35%)',
        'success-foreground': 'hsl(0 0% 98%)',
        'dev-mode': 'hsl(204, 86%, 53%)',
        'dev-mode-foreground': 'hsl(0 0% 98%)',
        border: 'oklch(0.2739 0.0055 286.0326)',
        input: 'oklch(0.2739 0.0055 286.0326)',
        ring: 'oklch(0.7613 0.1503 231.1314)',
        'chart-1': 'oklch(0.7613 0.1503 231.1314)',
        'chart-2': 'oklch(0.6268 0.2325 303.9004)',
        'chart-3': 'oklch(0.6450 0.2154 16.4393)',
        'chart-4': 'oklch(0.7686 0.1647 70.0804)',
        'chart-5': 'oklch(0.7227 0.1920 149.5793)',
        sidebar: 'oklch(0.1408 0.0044 285.8229)',
        'sidebar-foreground': 'oklch(0.9851 0 0)',
        'sidebar-primary': 'oklch(0.7613 0.1503 231.1314)',
        'sidebar-primary-foreground': 'oklch(0.1408 0.0044 285.8229)',
        'sidebar-accent': 'oklch(0.2739 0.0055 286.0326)',
        'sidebar-accent-foreground': 'oklch(0.9851 0 0)',
        'sidebar-border': 'oklch(0.2739 0.0055 286.0326)',
        'sidebar-ring': 'oklch(0.7613 0.1503 231.1314)',
        brand: '#17c1ff',
        'brand-lighter': '#e6f9ff',
        'brand-darker': '#0099ff',
        'font-sans': 'Inter, sans-serif',
        'font-mono': 'Geist Mono, monospace',
    },
};

export type ThemeVariablesPluginOptions = {
    theme?: ThemeVariables;
};

export function themeVariablesPlugin(options: ThemeVariablesPluginOptions): Plugin {
    const virtualModuleId = 'virtual:admin-theme';
    const resolvedVirtualModuleId = `\0${virtualModuleId}`;

    return {
        name: 'vendure:admin-theme',
        enforce: 'pre', // This ensures our plugin runs before other CSS processors
        transform(code, id) {
            // Only transform CSS files
            if (!id.endsWith('styles.css')) {
                return null;
            }

            // Replace the @import 'virtual:admin-theme'; with our theme variables
            if (
                code.includes('@import "virtual:admin-theme";') ||
                code.includes("@import 'virtual:admin-theme';")
            ) {
                const lightTheme = options.theme?.light || {};
                const darkTheme = options.theme?.dark || {};

                // Merge default themes with custom themes
                const mergedLightTheme = { ...defaultVariables.light, ...lightTheme };
                const mergedDarkTheme = { ...defaultVariables.dark, ...darkTheme };

                const themeCSS = `
                    :root {
                        ${Object.entries(mergedLightTheme)
                            .filter(([key, value]) => value !== undefined)
                            .map(([key, value]) => `--${key}: ${value as string};`)
                            .join('\n')}
                    }

                    .dark {
                        ${Object.entries(mergedDarkTheme)
                            .filter(([key, value]) => value !== undefined)
                            .map(([key, value]) => `--${key}: ${value as string};`)
                            .join('\n')}
                    }
                `;

                return code.replace(/@import ['"]virtual:admin-theme['"];?/, themeCSS);
            }

            return null;
        },
    };
}
