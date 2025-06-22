import dateFormat from 'dateformat';
import Handlebars from 'handlebars';
import * as jsdom from 'jsdom';
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

    private stripHtml(html: string): string {
        const dom = new jsdom.JSDOM(html);
        // Remove all <style> and <script> tags to avoid any unwanted content in the plaintext version.
        dom.window.document.body.querySelectorAll('style, script').forEach(el => el.remove());
        const textContent = dom.window.document.body.textContent || '';
        // Nested elements result in a lot of indentation-whitespace, this will look bad in plaintext emails,
        // so we replace leading whitespace on each line with a newline character to ensure that the text is readable.
        return textContent.replace(/^\s+/gm, '\n').trim();
    }

    generate(
        from: string,
        subject: string,
        template: string,
        templateVars: any,
    ): ReturnType<EmailGenerator['generate']> {
        const compiledFrom = Handlebars.compile(from, { noEscape: true });
        const compiledSubject = Handlebars.compile(subject);
        const compiledTemplate = Handlebars.compile(template);
        // We enable prototype properties here, aware of the security implications
        // described here: https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
        // This is needed because some Vendure entities use getters on the entity
        // prototype (e.g. Order.total) which may need to be interpolated.
        const templateOptions: RuntimeOptions = { allowProtoPropertiesByDefault: true };
        const fromResult = compiledFrom(templateVars, templateOptions);
        const subjectResult = compiledSubject(templateVars, templateOptions);
        const mjml = compiledTemplate(templateVars, templateOptions);
        const body = mjml2html(mjml).html;
        const text = this.stripHtml(body);
        return { from: fromResult, subject: subjectResult, body, text };
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
