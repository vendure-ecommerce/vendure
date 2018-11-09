import { EmailContext, GeneratedEmailContext } from '../../email/email-context';

import { EmailGenerator } from './email-options';

export class NoopEmailGenerator implements EmailGenerator {
    generate(context: EmailContext): GeneratedEmailContext | Promise<GeneratedEmailContext> {
        return new GeneratedEmailContext(context, 'email subject', 'email subject');
    }
}
