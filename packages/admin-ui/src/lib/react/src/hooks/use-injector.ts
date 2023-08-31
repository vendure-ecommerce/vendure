import { useContext } from 'react';
import { HostedComponentContext } from '../react-component-host.directive';

export function useInjector(token: any) {
    const context = useContext(HostedComponentContext);
    const instance = context?.injector.get(token);
    if (!instance) {
        throw new Error(`Could not inject ${token.name ?? token.toString()}`);
    }
    return instance;
}
