import path from 'path';

import { InternalServerError } from '../../common/error/errors';
import { EmailTransportOptions, VendureConfig, VendurePlugin } from '../../config';
import { defaultEmailTypes, HandlebarsMjmlGenerator } from '../../email';

/**
 * @description
 * Configuration for the DefaultEmailPlugin.
 *
 * @docsCategory plugin
 */
export interface DefaultEmailPluginOptions {
    /**
     * @description
     * The path to the location of the email templates. In a default Vendure installation,
     * the templates are installed to `<project root>/vendure/email/templates`.
     */
    templatePath: string;
    /**
     * @description
     * Configures how the emails are sent.
     */
    transport: EmailTransportOptions;
    /**
     * @description
     * Variables for use in email templates
     */
    templateVars: { [name: string]: any };
}

export interface DefaultEmailPluginDevModeOptions {
    templatePath: string;
    devMode: true;
    templateVars: { [name: string]: any };
}

/**
 * Configures the server to use the Handlebars / MJML email generator.
 */
export class DefaultEmailPlugin implements VendurePlugin {
    private readonly templatePath: string;
    private readonly transport: EmailTransportOptions;
    private readonly templateVars: { [name: string]: any };

    constructor(options: DefaultEmailPluginOptions | DefaultEmailPluginDevModeOptions) {
        this.templatePath = options.templatePath;
        this.templateVars = options.templateVars;
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
            templateVars: this.templateVars,
        };
        return config;
    }
}

function isDevModeOptions(
    input: DefaultEmailPluginOptions | DefaultEmailPluginDevModeOptions,
): input is DefaultEmailPluginDevModeOptions {
    return (input as DefaultEmailPluginDevModeOptions).devMode === true;
}
