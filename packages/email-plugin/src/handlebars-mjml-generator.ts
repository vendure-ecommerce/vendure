import dateFormat from 'dateformat';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import path from 'path';

import { EmailGenerator, EmailPluginDevModeOptions, EmailPluginOptions } from './types';

/**
 * Uses Handlebars (https://handlebarsjs.com/) to output MJML (https://mjml.io) which is then
 * compiled down to responsive email HTML.
 */
export class HandlebarsMjmlGenerator implements EmailGenerator {
    onInit(options: EmailPluginOptions | EmailPluginDevModeOptions) {
        const partialsPath = path.join(options.templatePath, 'partials');
        this.registerPartials(partialsPath);
        this.registerHelpers();
    }

    generate(from: string, subject: string, template: string, templateVars: any) {
        const compiledFrom = Handlebars.compile(from);
        const compiledSubject = Handlebars.compile(subject);
        const compiledTemplate = Handlebars.compile(template);
        // We enable prototype properties here, aware of the security implications
        // described here: https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
        // This is needed because some Vendure entities use getters on the entity
        // prototype (e.g. Order.total) which may need to be interpolated.
        const templateOptions: RuntimeOptions = { allowProtoPropertiesByDefault: true };
        const fromResult = compiledFrom(templateVars, { allowProtoPropertiesByDefault: true });
        const subjectResult = compiledSubject(templateVars, { allowProtoPropertiesByDefault: true });
        const mjml = compiledTemplate(templateVars, { allowProtoPropertiesByDefault: true });
        const body = mjml2html(mjml).html;
        return { from: fromResult, subject: subjectResult, body };
    }

    private registerPartials(partialsPath: string) {
        const partialsFiles = fs.readdirSync(partialsPath);
        for (const partialFile of partialsFiles) {
            const partialContent = fs.readFileSync(path.join(partialsPath, partialFile), 'utf-8');
            Handlebars.registerPartial(path.basename(partialFile, '.hbs'), partialContent);
        }
    }

    private registerHelpers() {
        Handlebars.registerHelper('formatDate', (date: Date | undefined, format: string | object) => {
            if (!date) {
                return date;
            }
            if (typeof format !== 'string') {
                format = 'default';
            }
            return dateFormat(date, format);
        });

        Handlebars.registerHelper('formatMoney', (amount?: number) => {
            if (amount == null) {
                return amount;
            }
            return (amount / 100).toFixed(2);
        });
    }
}
