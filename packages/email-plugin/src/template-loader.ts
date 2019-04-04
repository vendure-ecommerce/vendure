import fs from 'fs-extra';
import path from 'path';

import { EmailContext } from './email-context';
import { EmailOptions, TemplateConfig } from './types';

/**
 * Loads email templates according to the configured TemplateConfig values.
 */
export class TemplateLoader {
    constructor(private options: EmailOptions<any>) {}

    async loadTemplate(
        type: string,
        context: EmailContext,
    ): Promise<{ templateContext: any; subject: string; body: string }> {
        const { subject, templateContext, templatePath } = this.getTemplateConfig(type, context);
        const { emailTemplatePath } = this.options;
        const body = await fs.readFile(path.join(emailTemplatePath, templatePath), 'utf-8');

        return {
            templateContext: templateContext(context),
            subject,
            body,
        };
    }

    /**
     * Returns the corresponding TemplateConfig based on the channelCode and languageCode of the
     * EmailContext object.
     */
    private getTemplateConfig(type: string, context: EmailContext): TemplateConfig {
        const { emailTypes } = this.options;
        const typeConfig = emailTypes[type].templates;
        const channelConfig = typeConfig[context.channelCode] || typeConfig.defaultChannel;
        const languageConfig = channelConfig[context.languageCode] || channelConfig.defaultLanguage;
        return languageConfig;
    }
}
