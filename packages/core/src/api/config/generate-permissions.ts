import { stitchSchemas } from '@graphql-tools/stitch';
import { GraphQLEnumType, GraphQLInputObjectType, GraphQLSchema } from 'graphql';
import { GraphQLEnumValueConfigMap } from 'graphql/type/definition';

import { DEFAULT_PERMISSIONS } from '../../common/constants';
import { getAllPermissionsMetadata, PermissionDefinition } from '../../common/permission-definition';

const PERMISSION_DESCRIPTION = `@description
Permissions for administrators and customers. Used to control access to
GraphQL resolvers via the {@link Allow} decorator.

@docsCategory common`;

/**
 * Generates the `Permission` GraphQL enum based on the default & custom permission definitions.
 */
export function generatePermissionEnum(
    schema: GraphQLSchema,
    customPermissions: PermissionDefinition[],
): GraphQLSchema {
    const allPermissionsMetadata = getAllPermissionsMetadata(customPermissions);
    const values: GraphQLEnumValueConfigMap = {};
    let i = 0;
    for (const entry of allPermissionsMetadata) {
        values[entry.name] = {
            value: i,
            description: entry.description,
        };
        i++;
    }

    const permissionsEnum = new GraphQLEnumType({
        name: 'Permission',
        description: PERMISSION_DESCRIPTION,
        values,
    });

    return stitchSchemas({ schemas: [schema, [permissionsEnum]] });
}
