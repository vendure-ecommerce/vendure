import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory, GraphQLTypesLoader } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-core';
import { extendSchema, printSchema } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLJSON from 'graphql-type-json';
import * as path from 'path';

import { notNullOrUndefined } from '../../../../shared/shared-utils';
import { ConfigService } from '../../config/config.service';
import { I18nService } from '../../i18n/i18n.service';
import { TranslateErrorExtension } from '../middleware/translate-errors-extension';

import { addGraphQLCustomFields } from './graphql-custom-fields';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
    readonly typePaths = path.join(__dirname, '/../../**/*.graphql');

    constructor(
        private i18nService: I18nService,
        private configService: ConfigService,
        private typesLoader: GraphQLTypesLoader,
    ) {}

    createGqlOptions(): GqlModuleOptions {
        // Prevent `Type "Node" is missing a "resolveType" resolver.` warnings.
        // See https://github.com/apollographql/apollo-server/issues/1075
        const dummyResolveType = {
            __resolveType() {
                return null;
            },
        };

        return {
            path: '/' + this.configService.apiPath,
            typeDefs: this.createTypeDefs(),
            resolvers: {
                JSON: GraphQLJSON,
                DateTime: GraphQLDateTime,
                Node: dummyResolveType,
                PaginatedList: dummyResolveType,
                Upload: GraphQLUpload,
            },
            uploads: {
                maxFileSize: this.configService.assetOptions.uploadMaxFileSize,
            },
            playground: true,
            debug: true,
            context: req => req,
            extensions: [() => new TranslateErrorExtension(this.i18nService)],
            // This is handled by the Express cors plugin
            cors: false,
        };
    }

    /**
     * Generates the server's GraphQL schema by combining:
     * 1. the default schema as defined in the source .graphql files specified by `typePaths`
     * 2. any custom fields defined in the config
     * 3. any schema extensions defined by plugins
     */
    private createTypeDefs(): string {
        const customFields = this.configService.customFields;
        const typeDefs = this.typesLoader.mergeTypesByPaths(this.typePaths);
        let schema = addGraphQLCustomFields(typeDefs, customFields);
        const pluginTypes = this.configService.plugins
            .map(p => (p.defineGraphQlTypes ? p.defineGraphQlTypes() : undefined))
            .filter(notNullOrUndefined);
        for (const { types } of pluginTypes) {
            schema = extendSchema(schema, types);
        }
        return printSchema(schema);
    }
}
