import * as fs from 'fs-extra';
import * as opn from 'opn';
import * as path from 'path';

import { NoopEmailGenerator } from '../../config/email/noop-email-generator';
import { EmailOptions } from '../../config/vendure-config';
import { defaultEmailTypes } from '../default-email-types';
import { EmailContext } from '../email-context';
import { HandlebarsMjmlGenerator } from '../handlebars-mjml-generator';
import { TemplateLoader } from '../template-loader';

import { getEmailVerificationContext, getOrderReceiptContext } from './email-contexts';
// tslint:disable:no-console

const generator = new HandlebarsMjmlGenerator(path.join(__dirname, '../templates', 'partials'));
const emailOptions: EmailOptions<any> = {
    emailTypes: defaultEmailTypes,
    generator: new NoopEmailGenerator(),
    transport: {
        type: 'none',
    },
};
const loader = new TemplateLoader({ emailOptions } as any);

const emailType = process.argv[2];
if (!emailType) {
    failWith(`Please specify an emailType as the first argument. Example: order-confirmation`);
}

// tslint:disable-next-line
generateEmailPreview(emailType);

/**
 * Generates an .html file for the emailType specified as the first argument to the script.
 */
async function generateEmailPreview(type: string) {
    let emailContext: EmailContext | undefined;
    switch (type) {
        case 'order-confirmation':
            emailContext = getOrderReceiptContext();
            break;
        case 'email-verification':
            emailContext = getEmailVerificationContext();
            break;
    }
    if (!emailContext) {
        failWith(`Could not create a context for type "${type}"`);
        return;
    }
    const { subject, body, templateContext } = await loader.loadTemplate(type, emailContext);
    const generatedEmailContext = await generator.generate(subject, body, templateContext, emailContext);

    const previewDir = path.join(__dirname, 'output');
    await fs.ensureDir(previewDir);
    await fs.writeFile(path.join(previewDir, `${type}.html`), generatedEmailContext.body);
    await opn(path.join(previewDir, `${type}.html`));
}

function failWith(message: string) {
    console.error(message);
    process.exit(1);
}
