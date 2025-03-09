import { InjectableStrategy, VendureEvent } from '@vendure/core';

import { TextMessageDetails, TextMessagePluginOptions } from '../types';

/**
 * @description
 * A TextMessageGenerator generates the body details of a text message.
 *
 * @docsCategory core plugins/TextMessagePlugin
 * @docsPage TextMessageGenerator
 * @docsWeight 0
 */
export interface TextMessageGenerator<T extends string = any, E extends VendureEvent = any>
    extends InjectableStrategy {
    /**
     * @description
     * Any necessary setup can be performed here.
     */
    onInit?(options: TextMessagePluginOptions): void | Promise<void>;

    /**
     * @description
     * Given a subject and body from an email template, this method generates the final
     * interpolated email text.
     */
    generate(
        from: string,
        body: string,
        templateVars: { [key: string]: any },
    ): Pick<TextMessageDetails, 'from' | 'body'>;
}
