import { Injector, RequestContext } from '@vendure/core';

import { LoadTemplateInput, Partial } from '../types';

/**
 * @description
 * A dynamic template is a function that returns a string. This is useful when loading templates via libraries such as `react-email`.
 * @example
 * ```ts
 * import { render } from '@react-email/components';
 * import EmailComponent from './EmailComponent';
 *
 * async function renderReactEmail(input: LoadTemplateInput) {
 *   const { type, templateVars } = input;
 *   // assuming EmailComponent dynamically returns the component based on the type
 *   const component = <EmailComponent type={type} options={templateVars} />;
 *   return render(component);
 * }
 *
 * // inside loadTemplate()
 * return () => renderReactEmail(input);
 * ```
 */
export type DynamicTemplate = (() => string) | (() => Promise<string>);

/**
 * @description
 * Loads email templates based on the given request context, type and template name
 * and return the template as a string.
 *
 * @example
 * ```ts
 * import { EmailPlugin, TemplateLoader } from '\@vendure/email-plugin';
 *
 * class MyTemplateLoader implements TemplateLoader {
 *      loadTemplate(injector, ctx, { type, templateName }){
 *          return myCustomTemplateFunction(ctx);
 *      }
 * }
 *
 * // In vendure-config.ts:
 * ...
 * EmailPlugin.init({
 *     templateLoader: new MyTemplateLoader()
 *     ...
 * })
 * ```
 *
 * @docsCategory core plugins/EmailPlugin
 * @docsPage TemplateLoader
 * @docsWeight 0
 */
export interface TemplateLoader {
    /**
     * @description
     * Load template and return it's content as a string
     */
    loadTemplate(
        injector: Injector,
        ctx: RequestContext,
        input: LoadTemplateInput,
    ): Promise<string | DynamicTemplate>;

    /**
     * @description
     * Load partials and return their contents.
     * This method is only called during initialization, i.e. during server startup.
     */
    loadPartials?(): Promise<Partial[]>;
}
