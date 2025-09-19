import { PermissionDefinition } from '@vendure/core';
import { join } from 'path';

export const DEFAULT_APP_PATH = join(__dirname, 'dist');
export const loggerCtx = 'DashboardPlugin';
export const defaultLanguage = 'en';
export const defaultLocale = undefined;
export const defaultAvailableLanguages = ['en', 'de', 'es', 'cs', 'zh_Hans', 'pt_BR', 'pt_PT', 'zh_Hant'];
export const defaultAvailableLocales = ['en-US', 'de-DE', 'es-ES', 'zh-CN', 'zh-TW', 'pt-BR', 'pt-PT'];

export const MANAGE_DASHBOARD_GLOBAL_VIEWS_PERMISSION_NAME = 'ManageDashboardGlobalViews';
export const manageDashboardGlobalViews = new PermissionDefinition({
    name: MANAGE_DASHBOARD_GLOBAL_VIEWS_PERMISSION_NAME,
    description: 'Allows managing global views of data tables',
});
