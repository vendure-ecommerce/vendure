import { RequestContext } from '@vendure/core';

import { EmailPluginDevModeOptions, EmailPluginOptions, EmailTransportOptions } from './types';

export function isDevModeOptions(
    input: EmailPluginOptions | EmailPluginDevModeOptions,
): input is EmailPluginDevModeOptions {
    return (input as EmailPluginDevModeOptions).devMode === true;
}

export async function resolveTransportSettings(options: EmailPluginOptions ,ctx?: RequestContext): Promise<EmailTransportOptions> {
    if (typeof options.transport === 'function') {
        return options.transport(ctx);
    } else {
        return options.transport;
    }
}
