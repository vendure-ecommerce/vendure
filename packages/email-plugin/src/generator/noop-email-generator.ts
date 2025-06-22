import { EmailGenerator } from './email-generator';

/**
 * Simply passes through the subject and template content without modification.
 */
export class NoopEmailGenerator implements EmailGenerator {
    generate(
        from: string,
        subject: string,
        body: string,
        templateVars: any,
    ): ReturnType<EmailGenerator['generate']> {
        return { from, subject, body, text: body };
    }
}
