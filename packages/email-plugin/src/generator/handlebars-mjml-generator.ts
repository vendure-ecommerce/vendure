import dateFormat from 'dateformat';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';

import { InitializedEmailPluginOptions } from '../types';

import { EmailGenerator } from './email-generator';

/**
 * @description
 * Uses Handlebars (https://handlebarsjs.com/) to output MJML (https://mjml.io) which is then
 * compiled down to responsive email HTML.
 *
 * @docsCategory core plugins/EmailPlugin
 * @docsPage EmailGenerator
 */
export class HandlebarsMjmlGenerator implements EmailGenerator {
    async onInit(options: InitializedEmailPluginOptions) {
        if (options.templateLoader.loadPartials) {
            const partials = await options.templateLoader.loadPartials();
            partials.forEach(({ name, content }) => Handlebars.registerPartial(name, content));
        }
        this.registerHelpers();
    }

    private htmlToPlainText(html: string, wordwrap: number = 80): string {
        if (!html) return '';
        return convert(html, {
            wordwrap: wordwrap === 0 ? false : wordwrap,
            // selectors let you control how specific elements are handled
            selectors: [
                { selector: 'a.button', format: 'skip' },
                { selector: 'a.btn', format: 'skip' },
                { selector: 'a[data-button]', format: 'skip' },
                { selector: 'a', options: { leadingLineBreaks: 0, trailingLineBreaks: 0 } },
                { selector: 'img', format: 'image' },
            ],
            preserveNewlines: false,
        });
    }

    generate(from: string, subject: string, template: string, templateVars: any, text?: string) {
        const compiledFrom = Handlebars.compile(from, { noEscape: true });
        const compiledSubject = Handlebars.compile(subject);
        const compiledTemplate = Handlebars.compile(template);
        // We enable prototype properties here, aware of the security implications
        // described here: https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
        // This is needed because some Vendure entities use getters on the entity
        // prototype (e.g. Order.total) which may need to be interpolated.
        const runTimeOps: RuntimeOptions = { allowProtoPropertiesByDefault: true };
        const fromResult = compiledFrom(templateVars, runTimeOps);
        const subjectResult = compiledSubject(templateVars, runTimeOps);
        const mjml = compiledTemplate(templateVars, runTimeOps);
        const body = mjml2html(mjml).html;
        const plainText: string = text ? text : this.htmlToPlainText(body);
        return { from: fromResult, subject: subjectResult, body, text: plainText };
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

        Handlebars.registerHelper(
            'formatMoney',
            (amount?: number, currencyCode?: string, locale?: string) => {
                if (amount == null) {
                    return amount;
                }
                // Last parameter is a generic "options" object which is not used here.
                // If it's supplied, it means the helper function did not receive the additional, optional parameters.
                // See https://handlebarsjs.com/api-reference/helpers.html#the-options-parameter
                if (!currencyCode || typeof currencyCode === 'object') {
                    return new Intl.NumberFormat(typeof locale === 'object' ? undefined : locale, {
                        style: 'decimal',
                    }).format(amount / 100);
                }
                // Same reasoning for `locale` as for `currencyCode` here.
                return new Intl.NumberFormat(typeof locale === 'object' ? undefined : locale, {
                    style: 'currency',
                    currency: currencyCode,
                }).format(amount / 100);
            },
        );
    }
}
