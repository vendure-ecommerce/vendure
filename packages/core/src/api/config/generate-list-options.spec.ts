import { buildSchema, printType } from 'graphql';

import { generateListOptions } from './generate-list-options';
// tslint:disable:no-non-null-assertion

describe('generateListOptions()', () => {
    const COMMON_TYPES = `
    scalar JSON
    scalar DateTime

    interface PaginatedList {
        items: [Node!]!
        totalItems: Int!
    }

    interface Node {
        id: ID!
    }

    enum SortOrder {
        ASC
        DESC
    }

    input StringOperators { dummy: String }

    input BooleanOperators { dummy: String }

    input NumberRange { dummy: String }

    input NumberOperators { dummy: String }

    input DateRange { dummy: String }

    input DateOperators { dummy: String }

    type PersonList implements PaginatedList {
        items: [Person!]!
        totalItems: Int!
    }
    `;

    const removeLeadingWhitespace = (s: string) => {
        const indent = s.match(/^\s+/m)![0].replace(/\n/, '');
        return s.replace(new RegExp(`^${indent}`, 'gm'), '').trim();
    };

    it('creates the required input types', () => {
        const input = `
                ${COMMON_TYPES}
               type Query {
                   people(options: PersonListOptions): PersonList
               }

               type Person {
                   name: String!
                   age: Int!
               }

               # Generated at runtime
               input PersonListOptions
           `;

        const result = generateListOptions(buildSchema(input));

        expect(printType(result.getType('PersonListOptions')!)).toBe(
            removeLeadingWhitespace(`
                   input PersonListOptions {
                     skip: Int
                     take: Int
                     sort: PersonSortParameter
                     filter: PersonFilterParameter
                   }`),
        );

        expect(printType(result.getType('PersonSortParameter')!)).toBe(
            removeLeadingWhitespace(`
                   input PersonSortParameter {
                     name: SortOrder
                     age: SortOrder
                   }`),
        );

        expect(printType(result.getType('PersonFilterParameter')!)).toBe(
            removeLeadingWhitespace(`
                   input PersonFilterParameter {
                     name: StringOperators
                     age: NumberOperators
                   }`),
        );
    });

    it('works with a non-nullabel list type', () => {
        const input = `
                ${COMMON_TYPES}
               type Query {
                   people: PersonList!
               }

               type Person {
                   name: String!
                   age: Int!
               }
           `;

        const result = generateListOptions(buildSchema(input));

        expect(result.getType('PersonListOptions')).toBeTruthy();
    });

    it('uses the correct filter operators', () => {
        const input = `
                ${COMMON_TYPES}
               type Query {
                   people(options: PersonListOptions): PersonList
               }

               type Person {
                   name: String!
                   age: Int!
                   updatedAt: DateTime!
                   admin: Boolean!
                   score: Float
                   personType: PersonType!
               }

               enum PersonType {
                   TABS
                   SPACES
               }

               # Generated at runtime
               input PersonListOptions
           `;

        const result = generateListOptions(buildSchema(input));

        expect(printType(result.getType('PersonFilterParameter')!)).toBe(
            removeLeadingWhitespace(`
                   input PersonFilterParameter {
                     name: StringOperators
                     age: NumberOperators
                     updatedAt: DateOperators
                     admin: BooleanOperators
                     score: NumberOperators
                     personType: StringOperators
                   }`),
        );
    });

    it('creates the ListOptions interface and argument if not defined', () => {
        const input = `
               ${COMMON_TYPES}
               type Query {
                   people: PersonList
               }

               type Person {
                   name: String!
               }
           `;

        const result = generateListOptions(buildSchema(input));

        expect(printType(result.getType('PersonListOptions')!)).toBe(
            removeLeadingWhitespace(`
                    input PersonListOptions {
                      skip: Int
                      take: Int
                      sort: PersonSortParameter
                      filter: PersonFilterParameter
                    }`),
        );

        const args = result.getQueryType()!.getFields().people.args;
        expect(args.length).toBe(1);
        expect(args[0].name).toBe('options');
        expect(args[0].type.toString()).toBe('PersonListOptions');
    });

    it('extends the ListOptions interface if already defined', () => {
        const input = `
               ${COMMON_TYPES}
               type Query {
                   people(options: PersonListOptions): PersonList
               }

               type Person {
                   name: String!
               }

               input PersonListOptions {
                   categoryId: ID
               }
           `;

        const result = generateListOptions(buildSchema(input));

        expect(printType(result.getType('PersonListOptions')!)).toBe(
            removeLeadingWhitespace(`
                    input PersonListOptions {
                      categoryId: ID
                      skip: Int
                      take: Int
                      sort: PersonSortParameter
                      filter: PersonFilterParameter
                    }`),
        );

        const args = result.getQueryType()!.getFields().people.args;
        expect(args.length).toBe(1);
        expect(args[0].name).toBe('options');
        expect(args[0].type.toString()).toBe('PersonListOptions');
    });

    it('ignores properties with types which cannot be sorted or filtered', () => {
        const input = `
               ${COMMON_TYPES}
               type Query {
                   people: PersonList
               }

               type Person {
                   id: ID!
                   name: String!
                   vitals: [Int]
                   meta: JSON
                   user: User!
               }

               type User {
                   identifier: String!
               }
           `;

        const result = generateListOptions(buildSchema(input));

        expect(printType(result.getType('PersonSortParameter')!)).toBe(
            removeLeadingWhitespace(`
                   input PersonSortParameter {
                     id: SortOrder
                     name: SortOrder
                   }`),
        );

        expect(printType(result.getType('PersonFilterParameter')!)).toBe(
            removeLeadingWhitespace(`
                   input PersonFilterParameter {
                     name: StringOperators
                   }`),
        );
    });

    it('generates ListOptions for nested list queries', () => {
        const input = `
               ${COMMON_TYPES}
               type Query {
                   people: PersonList
               }

               type Person {
                   id: ID!
                   orders(options: OrderListOptions): OrderList
               }

               type OrderList implements PaginatedList {
                   items: [Order!]!
                   totalItems: Int!
               }

               type Order {
                   id: ID!
                   code: String!
               }

               # Generated at runtime
               input OrderListOptions
           `;

        const result = generateListOptions(buildSchema(input));

        expect(printType(result.getType('OrderListOptions')!)).toBe(
            removeLeadingWhitespace(`
                   input OrderListOptions {
                     skip: Int
                     take: Int
                     sort: OrderSortParameter
                     filter: OrderFilterParameter
                   }`),
        );
        expect(printType(result.getType('OrderSortParameter')!)).toBe(
            removeLeadingWhitespace(`
                   input OrderSortParameter {
                     id: SortOrder
                     code: SortOrder
                   }`),
        );

        expect(printType(result.getType('OrderFilterParameter')!)).toBe(
            removeLeadingWhitespace(`
                   input OrderFilterParameter {
                     code: StringOperators
                   }`),
        );
    });
});
