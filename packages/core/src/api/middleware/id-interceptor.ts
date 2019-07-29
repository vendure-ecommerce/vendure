import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { VariableValues } from 'apollo-server-core';
import { GraphQLNamedType, OperationDefinitionNode } from 'graphql';
import { Observable } from 'rxjs';

import { GraphqlValueTransformer } from '../common/graphql-value-transformer';
import { IdCodecService } from '../common/id-codec.service';
import { parseContext } from '../common/parse-context';

export const ID_CODEC_TRANSFORM_KEYS = 'idCodecTransformKeys';
type TypeTreeNode = {
    type: GraphQLNamedType | undefined;
    parent: TypeTreeNode | null;
    isList: boolean;
    children: { [name: string]: TypeTreeNode };
};

/**
 * This interceptor automatically decodes incoming requests so that any
 * ID values are transformed correctly as per the configured EntityIdStrategy.
 *
 * ID values are defined as properties with the name "id", or properties with names matching any
 * arguments passed to the {@link Decode} decorator.
 */
@Injectable()
export class IdInterceptor implements NestInterceptor {
    constructor(private idCodecService: IdCodecService) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const { isGraphQL, req } = parseContext(context);
        if (isGraphQL) {
            const args = GqlExecutionContext.create(context).getArgs();
            const info = GqlExecutionContext.create(context).getInfo();
            const graphqlValueTransformer = new GraphqlValueTransformer(info.schema);
            this.decodeIdArguments(graphqlValueTransformer, info.operation, args);
        }
        return next.handle();
    }

    private decodeIdArguments(
        graphqlValueTransformer: GraphqlValueTransformer,
        definition: OperationDefinitionNode,
        variables: VariableValues = {},
    ) {
        const typeTree = graphqlValueTransformer.getInputTypeTree(definition);
        graphqlValueTransformer.transformValues(typeTree, variables, (value, type) => {
            const isIdType = type && type.name === 'ID';
            return isIdType ? this.idCodecService.decode(value) : value;
        });
        return variables;
    }
}
