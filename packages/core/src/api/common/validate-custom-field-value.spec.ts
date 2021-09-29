import { LanguageCode } from '@vendure/common/lib/generated-types';

import { Injector } from '../../common/injector';

import { validateCustomFieldValue } from './validate-custom-field-value';

describe('validateCustomFieldValue()', () => {
    const injector = new Injector({} as any);

    async function assertThrowsError(validateFn: () => Promise<void>, message: string) {
        try {
            await validateFn();
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toBe(message);
        }
    }

    describe('string & localeString', () => {
        const validate = (value: string) => () =>
            validateCustomFieldValue(
                {
                    name: 'test',
                    type: 'string',
                    pattern: '^[0-9]+',
                },
                value,
                injector,
            );

        it('passes valid pattern', async () => {
            expect(await validate('1')).not.toThrow();
            expect(await validate('123')).not.toThrow();
            expect(await validate('1foo')).not.toThrow();
        });

        it('throws on invalid pattern', async () => {
            await assertThrowsError(validate(''), 'error.field-invalid-string-pattern');
            await assertThrowsError(validate('foo'), 'error.field-invalid-string-pattern');
            await assertThrowsError(validate(' 1foo'), 'error.field-invalid-string-pattern');
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
                injector,
            );

        it('passes valid option', async () => {
            expect(await validate('small')).not.toThrow();
            expect(await validate('large')).not.toThrow();
        });

        it('throws on invalid option', async () => {
            await assertThrowsError(validate('SMALL'), 'error.field-invalid-string-option');
            await assertThrowsError(validate(''), 'error.field-invalid-string-option');
            await assertThrowsError(validate('bad'), 'error.field-invalid-string-option');
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
                injector,
            );

        it('passes valid range', async () => {
            expect(await validate(5)).not.toThrow();
            expect(await validate(7)).not.toThrow();
            expect(await validate(10)).not.toThrow();
        });

        it('throws on invalid range', async () => {
            await assertThrowsError(validate(4), 'error.field-invalid-number-range-min');
            await assertThrowsError(validate(11), 'error.field-invalid-number-range-max');
            await assertThrowsError(validate(-7), 'error.field-invalid-number-range-min');
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
                injector,
            );

        it('passes valid range', async () => {
            expect(await validate('2019-01-01T08:30:00.000')).not.toThrow();
            expect(await validate('2019-06-01T08:30:00.000')).not.toThrow();
            expect(await validate('2019-04-12T14:15:51.200')).not.toThrow();
        });

        it('throws on invalid range', async () => {
            await assertThrowsError(
                validate('2019-01-01T08:29:00.000'),
                'error.field-invalid-datetime-range-min',
            );
            await assertThrowsError(
                validate('2019-06-01T08:30:00.100'),
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
                injector,
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
                injector,
                languageCode,
            );

        it('passes validate fn string', async () => {
            expect(await validate1('valid')).not.toThrow();
        });

        it('passes validate fn localized string', async () => {
            expect(await validate2('valid', LanguageCode.de)).not.toThrow();
        });

        it('fails validate fn string', async () => {
            await assertThrowsError(validate1('bad'), 'invalid');
        });

        it('fails validate fn localized string en', async () => {
            await assertThrowsError(validate2('bad', LanguageCode.en), 'invalid');
        });

        it('fails validate fn localized string de', async () => {
            await assertThrowsError(validate2('bad', LanguageCode.de), 'ungültig');
        });
    });
});
