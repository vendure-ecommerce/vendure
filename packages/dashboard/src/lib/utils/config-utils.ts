import { uiConfig } from 'virtual:vendure-ui-config';

export function getApiBaseUrl(): string {
    const schemeAndHost =
        uiConfig.api.host !== 'auto'
            ? uiConfig.api.host
            : `${window.location.protocol}//${window.location.hostname}`;
    const portPart = uiConfig.api.port !== 'auto' ? `:${uiConfig.api.port}` : '';

    return schemeAndHost + portPart;
}
