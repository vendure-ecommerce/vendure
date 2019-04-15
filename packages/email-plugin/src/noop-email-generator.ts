import { EmailGenerator } from './types';

/**
 * Simply passes through the subject and template content without modification.
 */
export class NoopEmailGenerator implements EmailGenerator {
    generate(
        subject: string,
        body: string,
        templateVars: any,
    ) {
        return { subject, body };
    }
}
