import { LogicalOperator } from '@vendure/common/lib/generated-types';
import { describe, expect, it } from 'vitest';

import { FilterParameter } from '../../../common/types/common-types';
import { ProductTranslation } from '../../../entity/product/product-translation.entity';
import { Product } from '../../../entity/product/product.entity';

import { parseFilterParams } from './parse-filter-params';
import { MockConnection } from './parse-sort-params.spec';

describe('parseFilterParams()', () => {
    it('works with no params', () => {
        const connection = new MockConnection();
        connection.setColumns(Product, [{ propertyName: 'id' }, { propertyName: 'image' }]);

        const result = parseFilterParams(connection as any, Product, {});
        expect(result).toEqual([]);
    });

    it('works with single param', () => {
        const connection = new MockConnection();
        connection.setColumns(Product, [{ propertyName: 'id' }, { propertyName: 'name' }]);
        const filterParams: FilterParameter<Product> = {
            name: {
                eq: 'foo',
            },
        };
        const result = parseFilterParams(connection as any, Product, filterParams);
        expect(result[0].clause).toBe('product.name = :arg1');
        expect(result[0].parameters).toEqual({ arg1: 'foo' });
    });

    it('works with multiple params', () => {
        const connection = new MockConnection();
        connection.setColumns(Product, [{ propertyName: 'id' }, { propertyName: 'name' }]);
        const filterParams: FilterParameter<Product> = {
            name: {
                eq: 'foo',
            },
            id: {
                eq: '123',
            },
        };
        const result = parseFilterParams(connection as any, Product, filterParams);
        expect(result[0].clause).toBe('product.name = :arg1');
        expect(result[0].parameters).toEqual({ arg1: 'foo' });
        expect(result[1].clause).toBe('product.id = :arg2');
        expect(result[1].parameters).toEqual({ arg2: '123' });
    });

    it('works with localized fields', () => {
        const connection = new MockConnection();
        connection.setColumns(Product, [{ propertyName: 'id' }, { propertyName: 'image' }]);
        connection.setRelations(Product, [{ propertyName: 'translations', type: ProductTranslation }]);
        connection.setColumns(ProductTranslation, [
            { propertyName: 'id' },
            { propertyName: 'name' },
            { propertyName: 'base', relationMetadata: {} as any },
        ]);
        const filterParams: FilterParameter<Product> = {
            name: {
                eq: 'foo',
            },
            id: {
                eq: '123',
            },
        };
        const result = parseFilterParams(connection as any, Product, filterParams);
        expect(result[0].clause).toBe('product__translations.name = :arg1');
        expect(result[0].parameters).toEqual({ arg1: 'foo' });
        expect(result[1].clause).toBe('product.id = :arg2');
        expect(result[1].parameters).toEqual({ arg2: '123' });
    });

    describe('string operators', () => {
        it('eq', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'name', type: String }]);
            const filterParams: FilterParameter<Product> = {
                name: {
                    eq: 'foo',
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.name = :arg1');
            expect(result[0].parameters).toEqual({ arg1: 'foo' });
        });

        it('contains', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'name', type: String }]);
            const filterParams: FilterParameter<Product> = {
                name: {
                    contains: 'foo',
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.name LIKE :arg1');
            expect(result[0].parameters).toEqual({ arg1: '%foo%' });
        });
    });

    describe('number operators', () => {
        it('eq', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'price', type: Number }]);
            const filterParams: FilterParameter<Product & { price: number }> = {
                price: {
                    eq: 123,
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.price = :arg1');
            expect(result[0].parameters).toEqual({ arg1: 123 });
        });

        it('lt', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'price', type: Number }]);
            const filterParams: FilterParameter<Product & { price: number }> = {
                price: {
                    lt: 123,
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.price < :arg1');
            expect(result[0].parameters).toEqual({ arg1: 123 });
        });

        it('lte', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'price', type: Number }]);
            const filterParams: FilterParameter<Product & { price: number }> = {
                price: {
                    lte: 123,
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.price <= :arg1');
            expect(result[0].parameters).toEqual({ arg1: 123 });
        });

        it('gt', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'price', type: Number }]);
            const filterParams: FilterParameter<Product & { price: number }> = {
                price: {
                    gt: 123,
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.price > :arg1');
            expect(result[0].parameters).toEqual({ arg1: 123 });
        });

        it('gte', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'price', type: Number }]);
            const filterParams: FilterParameter<Product & { price: number }> = {
                price: {
                    gte: 123,
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.price >= :arg1');
            expect(result[0].parameters).toEqual({ arg1: 123 });
        });

        it('between', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'price', type: Number }]);
            const filterParams: FilterParameter<Product & { price: number }> = {
                price: {
                    between: {
                        start: 10,
                        end: 50,
                    },
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.price BETWEEN :arg1_a AND :arg1_b');
            expect(result[0].parameters).toEqual({ arg1_a: 10, arg1_b: 50 });
        });
    });

    describe('date operators', () => {
        it('eq', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'createdAt', type: 'datetime' }]);
            const filterParams: FilterParameter<Product> = {
                createdAt: {
                    eq: new Date('2018-01-01T10:00:00.000Z'),
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.createdAt = :arg1');
            expect(result[0].parameters).toEqual({ arg1: '2018-01-01 10:00:00.000' });
        });

        it('before', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'createdAt', type: 'datetime' }]);
            const filterParams: FilterParameter<Product> = {
                createdAt: {
                    before: new Date('2018-01-01T10:00:00.000Z'),
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.createdAt < :arg1');
            expect(result[0].parameters).toEqual({ arg1: '2018-01-01 10:00:00.000' });
        });

        it('after', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'createdAt', type: 'datetime' }]);
            const filterParams: FilterParameter<Product> = {
                createdAt: {
                    after: new Date('2018-01-01T10:00:00.000Z'),
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.createdAt > :arg1');
            expect(result[0].parameters).toEqual({ arg1: '2018-01-01 10:00:00.000' });
        });

        it('between', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'createdAt', type: 'datetime' }]);
            const filterParams: FilterParameter<Product> = {
                createdAt: {
                    between: {
                        start: new Date('2018-01-01T10:00:00.000Z'),
                        end: new Date('2018-02-01T10:00:00.000Z'),
                    },
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.createdAt BETWEEN :arg1_a AND :arg1_b');
            expect(result[0].parameters).toEqual({
                arg1_a: '2018-01-01 10:00:00.000',
                arg1_b: '2018-02-01 10:00:00.000',
            });
        });
    });

    describe('boolean operators', () => {
        it('eq', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [{ propertyName: 'available', type: 'tinyint' }]);
            const filterParams: FilterParameter<Product & { available: boolean }> = {
                available: {
                    eq: true,
                },
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].clause).toBe('product.available = :arg1');
            expect(result[0].parameters).toEqual({ arg1: true });
        });
    });

    describe('nested boolean expressions', () => {
        it('simple _and', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [
                { propertyName: 'name', type: String },
                { propertyName: 'slug', type: String },
            ]);
            const filterParams = {
                _and: [
                    {
                        name: { eq: 'foo' },
                    },
                    {
                        slug: { eq: 'bar' },
                    },
                ],
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].operator).toBe(LogicalOperator.AND);
            expect(result[0].conditions).toEqual([
                { clause: 'product.name = :arg1', parameters: { arg1: 'foo' } },
                { clause: 'product.slug = :arg2', parameters: { arg2: 'bar' } },
            ]);
        });

        it('simple _or', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [
                { propertyName: 'name', type: String },
                { propertyName: 'slug', type: String },
            ]);
            const filterParams = {
                _or: [
                    {
                        name: { eq: 'foo' },
                    },
                    {
                        slug: { eq: 'bar' },
                    },
                ],
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result[0].operator).toBe(LogicalOperator.OR);
            expect(result[0].conditions).toEqual([
                { clause: 'product.name = :arg1', parameters: { arg1: 'foo' } },
                { clause: 'product.slug = :arg2', parameters: { arg2: 'bar' } },
            ]);
        });

        it('nested _or and _and', () => {
            const connection = new MockConnection();
            connection.setColumns(Product, [
                { propertyName: 'name', type: String },
                { propertyName: 'slug', type: String },
            ]);
            const filterParams = {
                _and: [
                    {
                        name: { eq: 'foo' },
                    },
                    {
                        _or: [{ slug: { eq: 'bar' } }, { slug: { eq: 'baz' } }],
                    },
                ],
            };
            const result = parseFilterParams(connection as any, Product, filterParams);
            expect(result).toEqual([
                {
                    operator: LogicalOperator.AND,
                    conditions: [
                        { clause: 'product.name = :arg1', parameters: { arg1: 'foo' } },
                        {
                            operator: LogicalOperator.OR,
                            conditions: [
                                { clause: 'product.slug = :arg2', parameters: { arg2: 'bar' } },
                                { clause: 'product.slug = :arg3', parameters: { arg3: 'baz' } },
                            ],
                        },
                    ],
                },
            ]);
        });
    });
});
