import { Injector, RequestContext } from '@vendure/core';

import { TextMessagePluginDevModeOptions, TextMessagePluginOptions, TextMessageTransportOptions } from './types';

export function isDevModeOptions(
    input: TextMessagePluginOptions | TextMessagePluginDevModeOptions,
): input is TextMessagePluginDevModeOptions {
    return (input as TextMessagePluginDevModeOptions).devMode === true;
}

export async function resolveTransportSettings(
    options: TextMessagePluginOptions,
    injector: Injector,
    ctx?: RequestContext
): Promise<TextMessageTransportOptions> {
    if (typeof options.transport === 'function') {
        return options.transport(injector, ctx);
    } else {
        return options.transport;
    }
}
