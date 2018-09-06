import { omit } from './omit';

describe('omit()', () => {

    it('returns a new object', () => {
        const obj = { foo: 1, bar: 2 };
        expect(omit(obj, ['bar'])).not.toBe(obj);
    });

    it('works with 1-level-deep objects', () => {
        expect(omit({ foo: 1, bar: 2 }, ['bar'])).toEqual({ foo: 1 });
        expect(omit({ foo: 1, bar: 2 }, ['bar', 'foo'])).toEqual({});
    });

    it('works with deeply-nested objects', () => {
        expect(omit({
            name: {
                first: 'joe',
                last: 'smith',
            },
            address: {
                number: 12,
            },
        }, ['address'])).toEqual({
            name: {
                first: 'joe',
                last: 'smith',
            },
        });
    });
});
