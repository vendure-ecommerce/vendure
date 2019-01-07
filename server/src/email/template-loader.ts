import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { ConfigService } from '../config/config.service';
import { TemplateConfig } from '../config/email/email-options';

import { EmailContext } from './email-context';

/**
 * Loads email templates according to the configured TemplateConfig values.
 */
@Injectable()
export class TemplateLoader {
    constructor(private configService: ConfigService) {}

    async loadTemplate(
        type: string,
        context: EmailContext,
    ): Promise<{ templateContext: any; subject: string; body: string }> {
        const { subject, templateContext, templatePath } = this.getTemplateConfig(type, context);
        const { emailTemplatePath } = this.configService.emailOptions;
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
        const { emailTypes } = this.configService.emailOptions;
        const typeConfig = emailTypes[type].templates;
        const channelConfig = typeConfig[context.channelCode] || typeConfig.defaultChannel;
        const languageConfig = channelConfig[context.languageCode] || channelConfig.defaultLanguage;
        return languageConfig;
    }
}
