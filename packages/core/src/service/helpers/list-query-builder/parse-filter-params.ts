import { Type } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { Connection } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { UserInputError } from '../../../common/error/errors';
import {
    BooleanOperators,
    DateOperators,
    FilterParameter,
    NullOptionals,
    NumberOperators,
    StringOperators,
} from '../../../common/types/common-types';
import { VendureEntity } from '../../../entity/base/base.entity';

export interface WhereCondition {
    clause: string;
    parameters: { [param: string]: string | number };
}

type AllOperators = StringOperators & BooleanOperators & NumberOperators & DateOperators;
type Operator = { [K in keyof AllOperators]-?: K }[keyof AllOperators];

export function parseFilterParams<T extends VendureEntity>(
    connection: Connection,
    entity: Type<T>,
    filterParams?: NullOptionals<FilterParameter<T>> | null,
): WhereCondition[] {
    if (!filterParams) {
        return [];
    }

    const metadata = connection.getMetadata(entity);
    const columns = metadata.columns;
    let translationColumns: ColumnMetadata[] = [];
    const relations = metadata.relations;

    const translationRelation = relations.find(r => r.propertyName === 'translations');
    if (translationRelation) {
        const translationMetadata = connection.getMetadata(translationRelation.type);
        translationColumns = columns.concat(translationMetadata.columns.filter(c => !c.relationMetadata));
    }

    const output: WhereCondition[] = [];
    const alias = metadata.name.toLowerCase();

    let argIndex = 1;
    for (const [key, operation] of Object.entries(filterParams)) {
        if (operation) {
            for (const [operator, operand] of Object.entries(operation as object)) {
                let fieldName: string;
                if (columns.find(c => c.propertyName === key)) {
                    fieldName = `${alias}.${key}`;
                } else if (translationColumns.find(c => c.propertyName === key)) {
                    fieldName = `${alias}_translations.${key}`;
                } else {
                    throw new UserInputError('error.invalid-filter-field');
                }
                const condition = buildWhereCondition(fieldName, operator as Operator, operand, argIndex);
                output.push(condition);
                argIndex++;
            }
        }
    }

    return output;
}

function buildWhereCondition(fieldName: string, operator: Operator, operand: any, argIndex: number): WhereCondition {
    switch (operator) {
        case 'eq':
            return {
                clause: `${fieldName} = :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: operand },
            };
        case 'contains':
            return {
                clause: `${fieldName} LIKE :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: `%${operand.trim()}%` },
            };
        case 'lt':
        case 'before':
            return {
                clause: `${fieldName} < :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: operand },
            };
        case 'gt':
        case 'after':
            return {
                clause: `${fieldName} > :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: operand },
            };
        case 'lte':
            return {
                clause: `${fieldName} <= :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: operand },
            };
        case 'gte':
            return {
                clause: `${fieldName} >= :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: operand },
            };
        case 'between':
            return {
                clause: `${fieldName} BETWEEN :arg${argIndex}_a AND :arg${argIndex}_b`,
                parameters: { [`arg${argIndex}_a`]: operand.start, [`arg${argIndex}_b`]: operand.end },
            };
        default:
            assertNever(operator);
    }
    return {
        clause: '1',
        parameters: {},
    };
}
