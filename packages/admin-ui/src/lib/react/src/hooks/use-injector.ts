import { ProviderToken } from '@angular/core';
import { useContext } from 'react';
import { HostedComponentContext } from '../react-component-host.directive';

export function useInjector<T = any>(token: ProviderToken<T>): T {
    const context = useContext(HostedComponentContext);
    const instance = context?.injector.get(token);
    if (!instance) {
        throw new Error(`Could not inject ${(token as any).name ?? token.toString()}`);
    }
    return instance;
}
