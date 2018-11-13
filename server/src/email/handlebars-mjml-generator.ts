import * as dateFormat from 'dateformat';
import * as fs from 'fs-extra';
import * as Handlebars from 'handlebars';
import mjml2html from 'mjml';
import * as path from 'path';

import { EmailGenerator } from '../config/email/email-options';

import { EmailContext, GeneratedEmailContext } from './email-context';

/**
 * Uses Handlebars (https://handlebarsjs.com/) to output MJML (https://mjml.io) which is then
 * compiled down to responsive email HTML.
 */
export class HandlebarsMjmlGenerator implements EmailGenerator {
    constructor(partialsPath: string) {
        this.registerPartials(partialsPath);
        this.registerHelpers();
    }

    generate(subject: string, template: string, context: EmailContext): GeneratedEmailContext {
        const compiledTemplate = Handlebars.compile(template);
        const compiledSubject = Handlebars.compile(subject);
        const subjectResult = compiledSubject(context);
        const mjml = compiledTemplate(context);
        const bodyResult = mjml2html(mjml);
        return new GeneratedEmailContext(context, subjectResult, bodyResult.html);
    }

    private registerPartials(partialsPath: string) {
        const partialsFiles = fs.readdirSync(partialsPath);
        for (const partialFile of partialsFiles) {
            const partialContent = fs.readFileSync(path.join(partialsPath, partialFile), 'utf-8');
            Handlebars.registerPartial(path.basename(partialFile, '.hbs'), partialContent);
        }
    }

    private registerHelpers() {
        Handlebars.registerHelper('formatDate', (date: Date, format: string | object) => {
            if (typeof format !== 'string') {
                format = 'default';
            }
            return dateFormat(date, format);
        });

        Handlebars.registerHelper('formatMoney', (amount: number) => {
            return (amount / 100).toFixed(2);
        });
    }
}
