import { TextMessageGenerator } from './text-message-generator';

/**
 * Simply passes through the subject and template content without modification.
 */
export class NoopTextMessageGenerator implements TextMessageGenerator {
    generate(from: string, body: string, templateVars: any) {
        return { from, body };
    }
}
