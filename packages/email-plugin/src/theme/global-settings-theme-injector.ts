import { Injector, RequestContext } from '@vendure/core';

import { EmailThemeInjector } from './theme-injector';

export class GlobalSettingsThemeInjector implements EmailThemeInjector {
    private globalTemplateVars;

    constructor(globalTemplateVars: { [key: string]: any }) {
        this.globalTemplateVars = globalTemplateVars;
    }

    injectTheme(_injector: Injector, _ctx: RequestContext) {
        return { ...this.globalTemplateVars, theme: {} };
    }
}
