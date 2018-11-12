import * as Handlebars from 'handlebars';
import mjml2html from 'mjml';

import { EmailGenerator } from '../config/email/email-options';

import { EmailContext, GeneratedEmailContext } from './email-context';

/**
 * Uses Handlebars (https://handlebarsjs.com/) to output MJML (https://mjml.io) which is then
 * compiled down to responsive email HTML.
 */
export class HandlebarsMjmlGenerator implements EmailGenerator {
    generate(subject: string, template: string, context: EmailContext): GeneratedEmailContext {
        const compiledTemplate = Handlebars.compile(template);
        const compiledSubject = Handlebars.compile(subject);
        const subjectResult = compiledSubject(context);
        const mjml = compiledTemplate(context);
        const bodyResult = mjml2html(mjml);
        return new GeneratedEmailContext(context, subjectResult, bodyResult.html);
    }
}
