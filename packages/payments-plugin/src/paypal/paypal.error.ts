import { I18nError } from '@vendure/core';

export class PayPalError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables);
    }
}
