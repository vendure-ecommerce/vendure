import { useServerConfig } from './use-server-config.js';

export function useCustomFieldConfig(entityType: string) {
    const serverConfig = useServerConfig();
    if (!serverConfig) {
        return [];
    }
    const customFieldConfig = serverConfig.entityCustomFields.find(field => field.entityName === entityType);
    return customFieldConfig?.customFields;
}
