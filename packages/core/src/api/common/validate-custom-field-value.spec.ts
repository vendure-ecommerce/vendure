import { LanguageCode } from '@vendure/common/lib/generated-types';

import { validateCustomFieldValue } from './validate-custom-field-value';

describe('validateCustomFieldValue()', () => {
    describe('string & localeString', () => {
        const validate = (value: string) => () =>
            validateCustomFieldValue(
                {
                    name: 'test',
                    type: 'string',
                    pattern: '^[0-9]+',
                },
                value,
            );

        it('passes valid pattern', () => {
            expect(validate('1')).not.toThrow();
            expect(validate('123')).not.toThrow();
            expect(validate('1foo')).not.toThrow();
        });

        it('throws on invalid pattern', () => {
            expect(validate('')).toThrowError('error.field-invalid-string-pattern');
            expect(validate('foo')).toThrowError('error.field-invalid-string-pattern');
            expect(validate(' 1foo')).toThrowError('error.field-invalid-string-pattern');
        });
    });

    describe('string options', () => {
        const validate = (value: string) => () =>
            validateCustomFieldValue(
                {
                    name: 'test',
                    type: 'string',
                    options: [{ value: 'small' }, { value: 'large' }],
                },
                value,
            );

        it('passes valid option', () => {
            expect(validate('small')).not.toThrow();
            expect(validate('large')).not.toThrow();
        });

        it('throws on invalid option', () => {
            expect(validate('SMALL')).toThrowError('error.field-invalid-string-option');
            expect(validate('')).toThrowError('error.field-invalid-string-option');
            expect(validate('bad')).toThrowError('error.field-invalid-string-option');
        });
    });

    describe('int & float', () => {
        const validate = (value: number) => () =>
            validateCustomFieldValue(
                {
                    name: 'test',
                    type: 'int',
                    min: 5,
                    max: 10,
                },
                value,
            );

        it('passes valid range', () => {
            expect(validate(5)).not.toThrow();
            expect(validate(7)).not.toThrow();
            expect(validate(10)).not.toThrow();
        });

        it('throws on invalid range', () => {
            expect(validate(4)).toThrowError('error.field-invalid-number-range-min');
            expect(validate(11)).toThrowError('error.field-invalid-number-range-max');
            expect(validate(-7)).toThrowError('error.field-invalid-number-range-min');
        });
    });

    describe('datetime', () => {
        const validate = (value: string) => () =>
            validateCustomFieldValue(
                {
                    name: 'test',
                    type: 'datetime',
                    min: '2019-01-01T08:30',
                    max: '2019-06-01T08:30',
                },
                value,
            );

        it('passes valid range', () => {
            expect(validate('2019-01-01T08:30:00.000')).not.toThrow();
            expect(validate('2019-06-01T08:30:00.000')).not.toThrow();
            expect(validate('2019-04-12T14:15:51.200')).not.toThrow();
        });

        it('throws on invalid range', () => {
            expect(validate('2019-01-01T08:29:00.000')).toThrowError(
                'error.field-invalid-datetime-range-min',
            );
            expect(validate('2019-06-01T08:30:00.100')).toThrowError(
                'error.field-invalid-datetime-range-max',
            );
        });
    });

    describe('validate function', () => {
        const validate1 = (value: string) => () =>
            validateCustomFieldValue(
                {
                    name: 'test',
                    type: 'string',
                    validate: (v: string) => {
                        if (v !== 'valid') {
                            return 'invalid';
                        }
                    },
                },
                value,
            );
        const validate2 = (value: string, languageCode: LanguageCode) => () =>
            validateCustomFieldValue(
                {
                    name: 'test',
                    type: 'string',
                    validate: (v: string) => {
                        if (v !== 'valid') {
                            return [
                                { languageCode: LanguageCode.en, value: 'invalid' },
                                { languageCode: LanguageCode.de, value: 'ungültig' },
                            ];
                        }
                    },
                },
                value,
                languageCode,
            );

        it('passes validate fn string', () => {
            expect(validate1('valid')).not.toThrow();
        });

        it('passes validate fn localized string', () => {
            expect(validate2('valid', LanguageCode.de)).not.toThrow();
        });

        it('fails validate fn string', () => {
            expect(validate1('bad')).toThrowError('invalid');
        });

        it('fails validate fn localized string en', () => {
            expect(validate2('bad', LanguageCode.en)).toThrowError('invalid');
        });

        it('fails validate fn localized string de', () => {
            expect(validate2('bad', LanguageCode.de)).toThrowError('ungültig');
        });
    });
});
