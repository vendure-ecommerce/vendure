import { Type } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

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
