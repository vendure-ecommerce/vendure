import { Connection } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { Type } from '../../../../../shared/shared-types';
import { assertNever } from '../../../../../shared/shared-utils';
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

    for (const [key, operation] of Object.entries(filterParams)) {
        if (operation) {
            for (const [operator, operand] of Object.entries(operation)) {
                let fieldName: string;
                if (columns.find(c => c.propertyName === key)) {
                    fieldName = `${alias}.${key}`;
                } else if (translationColumns.find(c => c.propertyName === key)) {
                    fieldName = `${alias}_translations.${key}`;
                } else {
                    throw new UserInputError('error.invalid-filter-field');
                }
                const condition = buildWhereCondition(fieldName, operator as Operator, operand);
                output.push(condition);
            }
        }
    }

    return output;
}

function buildWhereCondition(fieldName: string, operator: Operator, operand: any): WhereCondition {
    switch (operator) {
        case 'eq':
            return {
                clause: `${fieldName} = :arg1`,
                parameters: { arg1: operand },
            };
        case 'contains':
            return {
                clause: `${fieldName} LIKE :arg1`,
                parameters: { arg1: `%${operand.trim()}%` },
            };
        case 'lt':
        case 'before':
            return {
                clause: `${fieldName} < :arg1`,
                parameters: { arg1: operand },
            };
        case 'gt':
        case 'after':
            return {
                clause: `${fieldName} > :arg1`,
                parameters: { arg1: operand },
            };
        case 'lte':
            return {
                clause: `${fieldName} <= :arg1`,
                parameters: { arg1: operand },
            };
        case 'gte':
            return {
                clause: `${fieldName} >= :arg1`,
                parameters: { arg1: operand },
            };
        case 'between':
            return {
                clause: `${fieldName} BETWEEN :arg1 AND :arg2`,
                parameters: { arg1: operand.start, arg2: operand.end },
            };
        default:
            assertNever(operator);
    }
    return {
        clause: '1',
        parameters: {},
    };
}
