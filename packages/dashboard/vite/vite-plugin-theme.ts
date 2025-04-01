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
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(0 0% 3.9%)',
        card: 'hsl(0 0% 100%)',
        'card-foreground': 'hsl(0 0% 3.9%)',
        popover: 'hsl(0 0% 100%)',
        'popover-foreground': 'hsl(0 0% 3.9%)',
        primary: 'hsl(0 0% 9%)',
        'primary-foreground': 'hsl(0 0% 98%)',
        secondary: 'hsl(0 0% 96.1%)',
        'secondary-foreground': 'hsl(0 0% 9%)',
        muted: 'hsl(0 0% 96.1%)',
        'muted-foreground': 'hsl(0 0% 45.1%)',
        accent: 'hsl(0 0% 96.1%)',
        'accent-foreground': 'hsl(0 0% 9%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        'destructive-foreground': 'hsl(0 0% 98%)',
        success: 'hsl(100, 81%, 35%)',
        'success-foreground': 'hsl(0 0% 98%)',
        'dev-mode': 'hsl(204, 76%, 62%)',
        'dev-mode-foreground': 'hsl(0 0% 98%)',
        border: 'hsl(0 0% 89.8%)',
        input: 'hsl(0 0% 89.8%)',
        ring: 'hsl(0 0% 3.9%)',
        'chart-1': 'hsl(12 76% 61%)',
        'chart-2': 'hsl(173 58% 39%)',
        'chart-3': 'hsl(197 37% 24%)',
        'chart-4': 'hsl(43 74% 66%)',
        'chart-5': 'hsl(27 87% 67%)',
        radius: '0.6rem',
        sidebar: 'hsl(0 0% 98%)',
        'sidebar-foreground': 'hsl(240 5.3% 26.1%)',
        'sidebar-primary': 'hsl(240 5.9% 10%)',
        'sidebar-primary-foreground': 'hsl(0 0% 98%)',
        'sidebar-accent': 'hsl(0, 0%, 92%)',
        'sidebar-accent-foreground': 'hsl(240 5.9% 10%)',
        'sidebar-border': 'hsl(220 13% 91%)',
        'sidebar-ring': 'hsl(217.2 91.2% 59.8%)',
        brand: '#17c1ff',
        'brand-lighter': '#e6f9ff',
        'brand-darker': '#0099ff',
        'font-sans': "'Geist', sans-serif",
        'font-mono': "'Geist Mono', monospace",
    },
    dark: {
        background: 'hsl(0 0% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
        card: 'hsl(0 0% 3.9%)',
        'card-foreground': 'hsl(0 0% 98%)',
        popover: 'hsl(0 0% 3.9%)',
        'popover-foreground': 'hsl(0 0% 98%)',
        primary: 'hsl(0 0% 98%)',
        'primary-foreground': 'hsl(0 0% 9%)',
        secondary: 'hsl(0 0% 14.9%)',
        'secondary-foreground': 'hsl(0 0% 98%)',
        muted: 'hsl(0 0% 14.9%)',
        'muted-foreground': 'hsl(0 0% 63.9%)',
        accent: 'hsl(0 0% 14.9%)',
        'accent-foreground': 'hsl(0 0% 98%)',
        destructive: 'hsl(0 62.8% 30.6%)',
        'destructive-foreground': 'hsl(0 0% 98%)',
        success: 'hsl(100, 100%, 35%)',
        'success-foreground': 'hsl(0 0% 98%)',
        'dev-mode': 'hsl(204, 86%, 53%)',
        'dev-mode-foreground': 'hsl(0 0% 98%)',
        border: 'hsl(0 0% 14.9%)',
        input: 'hsl(0 0% 14.9%)',
        ring: 'hsl(0 0% 83.1%)',
        'chart-1': 'hsl(220 70% 50%)',
        'chart-2': 'hsl(160 60% 45%)',
        'chart-3': 'hsl(30 80% 55%)',
        'chart-4': 'hsl(280 65% 60%)',
        'chart-5': 'hsl(340 75% 55%)',
        sidebar: 'hsl(240 5.9% 10%)',
        'sidebar-foreground': 'hsl(240 4.8% 95.9%)',
        'sidebar-primary': 'hsl(224.3 76.3% 48%)',
        'sidebar-primary-foreground': 'hsl(0 0% 100%)',
        'sidebar-accent': 'hsl(240 3.7% 15.9%)',
        'sidebar-accent-foreground': 'hsl(240 4.8% 95.9%)',
        'sidebar-border': 'hsl(240 3.7% 15.9%)',
        'sidebar-ring': 'hsl(217.2 91.2% 59.8%)',
        brand: '#17c1ff',
        'brand-lighter': '#e6f9ff',
        'brand-darker': '#0099ff',
        'font-sans': "'Geist', sans-serif",
        'font-mono': "'Geist Mono', monospace",
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
