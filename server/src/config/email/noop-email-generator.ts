import { EmailContext, GeneratedEmailContext } from '../../email/email-context';

import { EmailGenerator } from './email-options';

/**
 * Simply passes through the subject and template content without modification.
 */
export class NoopEmailGenerator implements EmailGenerator {
    generate(subject: string, template: string, context: EmailContext): GeneratedEmailContext {
        return new GeneratedEmailContext(context, subject, template);
    }
}
