import { Injector, RequestContext } from '@vendure/core';

import { EmailThemeInjector } from './theme-injector';

abstract class BaseThemeInjector implements EmailThemeInjector {
    abstract injectTheme(
        ctx: RequestContext,
        injector: Injector,
        globalTemplateVars: { [key: string]: any },
    ):
        | Promise<{ [key: string]: any; theme: { [key: string]: any } }>
        | { [key: string]: any; theme: { [key: string]: any } };
}

export default BaseThemeInjector;
