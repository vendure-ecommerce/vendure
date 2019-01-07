import path from 'path';

import { InternalServerError } from '../../common/error/errors';
import { EmailTransportOptions, VendureConfig, VendurePlugin } from '../../config';
import { defaultEmailTypes, HandlebarsMjmlGenerator } from '../../email';

export interface DefaultEmailPluginOptions {
    templatePath: string;
    transport: EmailTransportOptions;
}

export interface DefaultEmailPluginDevModeOptions {
    templatePath: string;
    devMode: true;
}

/**
 * Configures the server to use the Handlebars / MJML email generator.
 */
export class DefaultEmailPlugin implements VendurePlugin {
    private readonly templatePath: string;
    private readonly transport: EmailTransportOptions;

    constructor(options: DefaultEmailPluginOptions | DefaultEmailPluginDevModeOptions) {
        this.templatePath = options.templatePath;
        if (isDevModeOptions(options)) {
            this.transport = {
                type: 'file',
                raw: false,
                outputPath: path.join(this.templatePath, '..', 'test-emails'),
            };
        } else {
            if (!options.transport) {
                throw new InternalServerError(
                    `When devMode is not set to true, the 'transport' property must be set.`,
                );
            }
            this.transport = options.transport;
        }
    }

    configure(config: Required<VendureConfig>): Required<VendureConfig> {
        config.emailOptions = {
            emailTemplatePath: this.templatePath,
            emailTypes: defaultEmailTypes,
            generator: new HandlebarsMjmlGenerator(),
            transport: this.transport,
        };
        return config;
    }
}

function isDevModeOptions(
    input: DefaultEmailPluginOptions | DefaultEmailPluginDevModeOptions,
): input is DefaultEmailPluginDevModeOptions {
    return (input as DefaultEmailPluginDevModeOptions).devMode === true;
}
