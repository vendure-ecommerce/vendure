import { Type } from '@vendure/common/lib/shared-types';
import { Column, getMetadataArgsStorage, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EmbeddedMetadataArgs } from 'typeorm/metadata-args/EmbeddedMetadataArgs';

import { EntityIdStrategy } from '../config/entity/entity-id-strategy';

import { getIdColumnsFor, getPrimaryGeneratedIdColumn } from './entity-id.decorator';

export function setEntityIdStrategy(entityIdStrategy: EntityIdStrategy<any>, entities: Array<Type<any>>) {
    setBaseEntityIdType(entityIdStrategy);

    // eslint-disable-next-line @typescript-eslint/ban-types
    const customFieldEntities: Array<Type<any>> = [];
    // get all the CustomField classes associated with the entities
    const metadataArgsStorage = getMetadataArgsStorage();
    for (const EntityCtor of entities) {
        const entityName = EntityCtor.name;
        const customFieldsMetadata = getCustomFieldsMetadata(entityName);
        const customFieldsClass = customFieldsMetadata?.type();
        if (customFieldsClass && typeof customFieldsClass !== 'string') {
            customFieldEntities.push(customFieldsClass as Type<any>);
        }
    }

    setEntityIdColumnTypes(entityIdStrategy, [...entities, ...customFieldEntities]);

    // eslint-disable-next-line @typescript-eslint/ban-types
    function getCustomFieldsMetadata(entity: Function | string): EmbeddedMetadataArgs | undefined {
        const entityName = typeof entity === 'string' ? entity : entity.name;
        const metadataArgs = metadataArgsStorage.embeddeds.find(item => {
            if (item.propertyName === 'customFields') {
                const targetName = typeof item.target === 'string' ? item.target : item.target.name;
                return targetName === entityName;
            }
        });

        if (!metadataArgs) {
            // throw new Error(`Could not find embedded CustomFields property on entity "${entityName}"`);
        }
        return metadataArgs;
    }
}

function setEntityIdColumnTypes(entityIdStrategy: EntityIdStrategy<any>, entities: Array<Type<any>>) {
    const columnDataType = entityIdStrategy.primaryKeyType === 'increment' ? 'int' : 'varchar';
    for (const EntityCtor of entities) {
        const columnConfig = getIdColumnsFor(EntityCtor);
        for (const { name, options, entity } of columnConfig) {
            Column({
                type: columnDataType,
                nullable: (options && options.nullable) || false,
                primary: (options && options.primary) || false,
            })(entity, name);
        }
    }
}

function setBaseEntityIdType(entityIdStrategy: EntityIdStrategy<any>) {
    const { entity, name } = getPrimaryGeneratedIdColumn();
    PrimaryGeneratedColumn(entityIdStrategy.primaryKeyType)(entity, name);
}
