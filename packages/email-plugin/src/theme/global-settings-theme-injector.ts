import { Injector, RequestContext } from '@vendure/core';

import BaseThemeInjector from './BaseThemeInjector';

export class GlobalSettingsThemeInjector extends BaseThemeInjector {
    injectTheme(_ctx: RequestContext, _injector: Injector, globalTemplateVars: { [key: string]: any }) {
        return { theme: {}, ...globalTemplateVars };
    }
}
