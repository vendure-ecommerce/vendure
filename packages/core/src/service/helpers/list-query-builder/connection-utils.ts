import { Type } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { CalculatedColumnDefinition, CALCULATED_PROPERTIES } from '../../../common/calculated-decorator';

/**
 * @description
 * Returns TypeORM ColumnMetadata for the given entity type.
 */
export function getColumnMetadata<T>(connection: Connection, entity: Type<T>) {
    const metadata = connection.getMetadata(entity);
    const columns = metadata.columns;
    let translationColumns: ColumnMetadata[] = [];
    const relations = metadata.relations;

    const translationRelation = relations.find(r => r.propertyName === 'translations');
    if (translationRelation) {
        const translationMetadata = connection.getMetadata(translationRelation.type);
        translationColumns = columns.concat(translationMetadata.columns.filter(c => !c.relationMetadata));
    }
    const alias = metadata.name.toLowerCase();
    return { columns, translationColumns, alias };
}

export function getEntityAlias<T>(connection: Connection, entity: Type<T>): string {
    return connection.getMetadata(entity).name.toLowerCase();
}

/**
 * @description
 * Escapes identifiers in an expression according to the current database driver.
 */
export function escapeCalculatedColumnExpression(connection: Connection, expression: string): string {
    return expression.replace(/\b([a-z]+[A-Z]\w+)\b/g, substring => connection.driver.escape(substring));
}
