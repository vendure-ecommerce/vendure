import { Test } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { DECODED, ENCODED, MockConfigService } from './config.service.mock';
import { IdCodecService } from './id-codec.service';

describe('IdCodecService', () => {
    let idCodecService: IdCodecService;
    let configService: MockConfigService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [IdCodecService, { provide: ConfigService, useClass: MockConfigService }],
        }).compile();

        idCodecService = module.get(IdCodecService);
        configService = module.get(ConfigService) as any;
    });

    describe('encode()', () => {
        it('works with a string', () => {
            const input = 'id';

            const result = idCodecService.encode(input);
            expect(result).toEqual(ENCODED);
        });

        it('works with a number', () => {
            const input = 123;

            const result = idCodecService.encode(input);
            expect(result).toEqual(ENCODED);
        });

        it('works with simple entity', () => {
            const input = { id: 'id', name: 'foo' };

            const result = idCodecService.encode(input);
            expect(result).toEqual({ id: ENCODED, name: 'foo' });
        });

        it('works with 2-level nested entities', () => {
            const input = {
                id: 'id',
                friend: { id: 'id' },
            };

            const result = idCodecService.encode(input);
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

            const result = idCodecService.encode(input);
            expect(result).toEqual({
                id: ENCODED,
                friend: {
                    dog: { id: ENCODED },
                },
            });
        });

        it('works with list of simple entities', () => {
            const input = [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }];

            const result = idCodecService.encode(input);
            expect(result).toEqual([{ id: ENCODED, name: 'foo' }, { id: ENCODED, name: 'bar' }]);
        });

        it('does not throw with an empty list', () => {
            const input = [];

            const result = idCodecService.encode(input);
            expect(() => idCodecService.encode(input)).not.toThrow();
        });

        it('works with nested list of simple entities', () => {
            const input = {
                items: [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }],
            };

            const result = idCodecService.encode(input);
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

            const result = idCodecService.encode(input);
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

            const result = idCodecService.encode(input);
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
    });

    describe('decode()', () => {
        it('works with a string', () => {
            const input = 'id';

            const result = idCodecService.decode(input);
            expect(result).toEqual(DECODED);
        });

        it('works with a number', () => {
            const input = 123;

            const result = idCodecService.decode(input);
            expect(result).toEqual(DECODED);
        });

        it('works with simple entity', () => {
            const input = { id: 'id', name: 'foo' };

            const result = idCodecService.decode(input);
            expect(result).toEqual({ id: DECODED, name: 'foo' });
        });

        it('works with 2-level nested entities', () => {
            const input = {
                id: 'id',
                friend: { id: 'id' },
            };

            const result = idCodecService.decode(input);
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

            const result = idCodecService.decode(input);
            expect(result).toEqual({
                id: DECODED,
                friend: {
                    dog: { id: DECODED },
                },
            });
        });

        it('works with list of simple entities', () => {
            const input = [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }];

            const result = idCodecService.decode(input);
            expect(result).toEqual([{ id: DECODED, name: 'foo' }, { id: DECODED, name: 'bar' }]);
        });

        it('works with nested list of simple entities', () => {
            const input = {
                items: [{ id: 'id', name: 'foo' }, { id: 'id', name: 'bar' }],
            };

            const result = idCodecService.decode(input);
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

            const result = idCodecService.decode(input);
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

            const result = idCodecService.decode(input);
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
    });
});
