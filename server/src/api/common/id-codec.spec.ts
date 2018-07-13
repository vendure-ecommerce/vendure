import { DECODED, ENCODED, MockIdStrategy } from '../../service/config.service.mock';

import { IdCodec } from './id-codec';

describe('IdCodecService', () => {
    let idCodec: IdCodec;

    beforeEach(async () => {
        idCodec = new IdCodec(new MockIdStrategy());
    });

    describe('encode()', () => {
        it('works with a string', () => {
            const input = 'id';

            const result = idCodec.encode(input);
            expect(result).toEqual(ENCODED);
        });

        it('works with a number', () => {
            const input = 123;

            const result = idCodec.encode(input);
            expect(result).toEqual(ENCODED);
        });

        it('passes through null or undefined without throwing', () => {
            expect(idCodec.encode(null as any)).toBeNull();
            expect(idCodec.encode(undefined as any)).toBeUndefined();
        });

        it('works with simple entity', () => {
            const input = { id: 'id', name: 'foo' };

            const result = idCodec.encode(input);
            expect(result).toEqual({ id: ENCODED, name: 'foo' });
        });

        it('works with 2-level nested entities', () => {
            const input = {
                id: 'id',
                friend: { id: 'id' },
            };

            const result = idCodec.encode(input);
            expect(result).toEqual({
                id: ENCODED,
                friend: { id: ENCODED },
            });
        });

        it('works with 3-level nested entities', () => {
            const input = {
                id: 'id',
                friend: {
                    dog: { id: 'id' },
                },
            };

            const result = idCodec.encode(input);
            expect(result).toEqual({
                id: ENCODED,
                friend: {
                    dog: { id: ENCODED },
                },
            });
        });

        it('works with list of simple entities', () => {
            const input = [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }];

            const result = idCodec.encode(input);
            expect(result).toEqual([{ id: ENCODED, name: 'foo' }, { id: ENCODED, name: 'bar' }]);
        });

        it('does not throw with an empty list', () => {
            const input = [];

            const result = idCodec.encode(input);
            expect(() => idCodec.encode(input)).not.toThrow();
        });

        it('works with nested list of simple entities', () => {
            const input = {
                items: [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }],
            };

            const result = idCodec.encode(input);
            expect(result).toEqual({
                items: [{ id: ENCODED, name: 'foo' }, { id: ENCODED, name: 'bar' }],
            });
        });

        it('works with large and nested list', () => {
            const length = 100;
            const input = {
                items: Array.from({ length }).map(() => ({
                    id: 'id',
                    name: { bar: 'baz' },
                    foo: 'yo',
                    friends: [{ id: 'id', name: { first: 'boris', id: 'id' } }],
                })),
            };

            const result = idCodec.encode(input);
            expect(result.items.length).toBe(length);
            expect(result.items[0].id).toBe(ENCODED);
            expect(result.items[0].friends[0].id).toBe(ENCODED);
            expect(result.items[0].friends[0].name.id).toBe(ENCODED);
        });

        it('works with nested list of nested lists', () => {
            const input = {
                items: [
                    {
                        id: 'id',
                        friends: [{ id: 'id' }, { id: 'id' }],
                    },
                    {
                        id: 'id',
                        friends: [{ id: 'id' }, { id: 'id' }],
                    },
                ],
            };

            const result = idCodec.encode(input);
            expect(result).toEqual({
                items: [
                    {
                        id: ENCODED,
                        friends: [{ id: ENCODED }, { id: ENCODED }],
                    },
                    {
                        id: ENCODED,
                        friends: [{ id: ENCODED }, { id: ENCODED }],
                    },
                ],
            });
        });

        it('transformKeys can be customized', () => {
            const input = { id: 'id', name: 'foo' };

            const result = idCodec.encode(input, ['name']);
            expect(result).toEqual({ id: 'id', name: ENCODED });
        });
    });

    describe('decode()', () => {
        it('works with a string', () => {
            const input = 'id';

            const result = idCodec.decode(input);
            expect(result).toEqual(DECODED);
        });

        it('works with a number', () => {
            const input = 123;

            const result = idCodec.decode(input);
            expect(result).toEqual(DECODED);
        });

        it('works with simple entity', () => {
            const input = { id: 'id', name: 'foo' };

            const result = idCodec.decode(input);
            expect(result).toEqual({ id: DECODED, name: 'foo' });
        });

        it('works with 2-level nested entities', () => {
            const input = {
                id: 'id',
                friend: { id: 'id' },
            };

            const result = idCodec.decode(input);
            expect(result).toEqual({
                id: DECODED,
                friend: { id: DECODED },
            });
        });

        it('works with 3-level nested entities', () => {
            const input = {
                id: 'id',
                friend: {
                    dog: { id: 'id' },
                },
            };

            const result = idCodec.decode(input);
            expect(result).toEqual({
                id: DECODED,
                friend: {
                    dog: { id: DECODED },
                },
            });
        });

        it('works with list of simple entities', () => {
            const input = [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }];

            const result = idCodec.decode(input);
            expect(result).toEqual([{ id: DECODED, name: 'foo' }, { id: DECODED, name: 'bar' }]);
        });

        it('works with nested list of simple entities', () => {
            const input = {
                items: [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }],
            };

            const result = idCodec.decode(input);
            expect(result).toEqual({
                items: [{ id: DECODED, name: 'foo' }, { id: DECODED, name: 'bar' }],
            });
        });

        it('works with large and nested list', () => {
            const length = 100;
            const input = {
                items: Array.from({ length }).map(() => ({
                    id: 'id',
                    name: { bar: 'baz' },
                    foo: 'yo',
                    friends: [{ id: 'id', name: { first: 'boris', id: 'id' } }],
                })),
            };

            const result = idCodec.decode(input);
            expect(result.items.length).toBe(length);
            expect(result.items[0].id).toBe(DECODED);
            expect(result.items[0].friends[0].id).toBe(DECODED);
            expect(result.items[0].friends[0].name.id).toBe(DECODED);
        });

        it('works with nested list of nested lists', () => {
            const input = {
                items: [
                    {
                        id: 'id',
                        friends: [{ id: 'id' }, { id: 'id' }],
                    },
                    {
                        id: 'id',
                        friends: [{ id: 'id' }, { id: 'id' }],
                    },
                ],
            };

            const result = idCodec.decode(input);
            expect(result).toEqual({
                items: [
                    {
                        id: DECODED,
                        friends: [{ id: DECODED }, { id: DECODED }],
                    },
                    {
                        id: DECODED,
                        friends: [{ id: DECODED }, { id: DECODED }],
                    },
                ],
            });
        });

        it('transformKeys can be customized', () => {
            const input = { id: 'id', name: 'foo' };

            const result = idCodec.decode(input, ['name']);
            expect(result).toEqual({ id: 'id', name: DECODED });
        });
    });
});
