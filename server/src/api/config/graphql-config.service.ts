import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory, GraphQLTypesLoader } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-core';
import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLJSON from 'graphql-type-json';
import * as path from 'path';

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

    private createTypeDefs(): string {
        const customFields = this.configService.customFields;
        const typeDefs = this.typesLoader.mergeTypesByPaths(this.typePaths);
        return addGraphQLCustomFields(typeDefs, customFields);
    }
}
