/**
 * Verifies if a relation has already been joined in a query builder to prevent duplicate joins.
 * This method ensures query efficiency and correctness by maintaining unique joins within the query builder.
 *
 * @param {SelectQueryBuilder<T>} qb The query builder instance where the joins are being added.
 * @param {string} alias The join alias to check for uniqueness. This alias is used to determine if the relation
 *                       has already been joined to avoid adding duplicate join statements.
 * @returns boolean Returns true if the relation has already been joined (based on the alias), false otherwise.
 * @template T extends VendureEntity The entity type for which the query builder is configured.
 */
import { VendureEntity } from '../../../entity';
import { EntityMetadata, SelectQueryBuilder } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';

/**
 * @description
 * Check if the current entity has one or more self-referencing relations
 * to determine if it is a tree type or has tree relations.
 * @param metadata
 * @private
 */
function isTreeEntityMetadata(metadata: EntityMetadata): boolean {
    if (metadata.treeType !== undefined) {
        return true;
    }

    for (const relation of metadata.relations) {
        if (relation.isTreeParent || relation.isTreeChildren) {
            return true;
        }
        if (relation.inverseEntityMetadata === metadata) {
            return true;
        }
    }
    return false
}

/**
 * These method are designed to address specific challenges encountered with TypeORM
 * when dealing with complex relation structures, particularly around the 'collection'
 * entity and other similar entities, and they nested relations ('parent', 'children'). The need for these custom
 * implementations arises from limitations in handling deeply nested relations and ensuring
 * efficient query generation without duplicate joins, as discussed in TypeORM issue #9936.
 * See https://github.com/typeorm/typeorm/issues/9936 for more context.
 *
 * Dynamically joins tree relations and their eager relations to a query builder. This method is specifically
 * designed for entities utilizing TypeORM tree decorators (@TreeParent, @TreeChildren) and aims to address
 * the challenge of efficiently managing deeply nested relations and avoiding duplicate joins. The method
 * automatically handles the joining of related entities marked with tree relation decorators and eagerly
 * loaded relations, ensuring efficient data retrieval and query generation.
 *
 * The method iterates over the requested relations paths, joining each relation dynamically. For tree relations,
 * it also recursively joins all associated eager relations. This approach avoids the manual specification of joins
 * and leverages TypeORM's relation metadata to automate the process.
 *
 * @param {SelectQueryBuilder<T>} qb The query builder instance to which the relations will be joined.
 * @param {EntityTarget<T>} entity The target entity class or schema name. This parameter is used to access
 *                                 the entity's metadata and analyze its relations.
 * @param {string[]} requestedRelations An array of strings representing the relation paths to be dynamically joined.
 *                                      Each string in the array should denote a path to a relation (e.g., 'parent.parent.children').
 * @returns {Set<string>} A Set containing the paths of relations that were dynamically joined. This set can be used
 *                        to track which relations have been processed and potentially avoid duplicate processing.
 * @template T extends VendureEntity The type of the entity for which relations are being joined. This type parameter
 *                                    should extend VendureEntity to ensure compatibility with Vendure's data access layer.
 */
export function joinTreeRelationsDynamically<T extends VendureEntity>(
    qb: SelectQueryBuilder<T>,
    entity: EntityTarget<T>,
    requestedRelations: string[] = [],
): Set<string> {
    const processedRelations = new Set<string>();
    if (!requestedRelations.length) {
        return processedRelations;
    }

    const sourceMetadata = qb.connection.getMetadata(entity);
    const isTreeSourceMetadata = isTreeEntityMetadata(sourceMetadata)

    const processRelation = (
        currentMetadata: EntityMetadata,
        currentPath: string,
        currentAlias: string,
    ) => {
        if (!isTreeEntityMetadata(currentMetadata) && !isTreeSourceMetadata) {
            return;
        }

        const parts = currentPath.split('.');
        const part = parts.shift();

        if (!part || !currentMetadata) return;

        const relationMetadata = currentMetadata.findRelationWithPropertyPath(part);
        if (relationMetadata) {
            const isEager = relationMetadata.isEager;
            let joinConnector = '_';
            if (isEager) {
                joinConnector = '__';
            }
            const nextAlias = `${currentAlias}${joinConnector}${part}`;
            const nextPath = parts.join('.');

            if (!qb.expressionMap.joinAttributes.some(ja => ja.alias.name === nextAlias)) {
                qb.leftJoinAndSelect(`${currentAlias}.${part}`, nextAlias);
            }

            const isTree = isTreeEntityMetadata(relationMetadata.inverseEntityMetadata);

            if (isTree) {
                relationMetadata.inverseEntityMetadata.relations.forEach(subRelation => {
                    if (subRelation.isEager) {
                        processRelation(
                            relationMetadata.inverseEntityMetadata,
                            subRelation.propertyPath,
                            nextAlias,
                        );
                    }
                });
            }

            if (nextPath) {
                processRelation(
                    relationMetadata.inverseEntityMetadata,
                    nextPath,
                    nextAlias,
                );
            }
            processedRelations.add(currentPath);
        }
    };

    requestedRelations.forEach(relationPath => {
        processRelation(sourceMetadata, relationPath, qb.alias);
    });

    return processedRelations;
}
