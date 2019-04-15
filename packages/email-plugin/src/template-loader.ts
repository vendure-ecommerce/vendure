import { LanguageCode } from '@vendure/common/src/generated-types';
import fs from 'fs-extra';
import path from 'path';

/**
 * Loads email templates according to the configured TemplateConfig values.
 */
export class TemplateLoader {
    constructor(private templatePath: string) {}

    async loadTemplate(
        type: string,
        channelCode: string,
        languageCode: LanguageCode,
    ): Promise<string> {
        // TODO: logic to select other files based on channel / language
        const templatePath = path.join(this.templatePath, type, 'body.hbs');
        const body = await fs.readFile(path.join(this.templatePath, type, 'body.hbs'), 'utf-8');
        return body;
    }
}
