import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-core';
import * as fs from 'fs';
import * as glob from 'glob';
import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLJSON from 'graphql-type-json';
import { flatten } from 'lodash';
import { mergeTypes } from 'merge-graphql-schemas';
import * as path from 'path';

import { ConfigService } from '../config/config.service';
import { I18nService } from '../i18n/i18n.service';

import { addGraphQLCustomFields } from './graphql-custom-fields';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
    readonly typePaths = path.join(__dirname, '/../**/*.graphql');

    constructor(private i18nService: I18nService, private configService: ConfigService) {}

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
                maxFileSize: this.configService.uploadMaxFileSize,
            },
            playground: true,
            debug: true,
            context: req => req,
            // TODO: Need to also pass the Express context object for correct translations.
            // See https://github.com/apollographql/apollo-server/issues/1343
            formatError: err => {
                return this.i18nService.translateError(err);
            },
        };
    }

    private createTypeDefs(): string {
        const customFields = this.configService.customFields;
        const typeDefs = mergeTypesByPaths(this.typePaths);
        return addGraphQLCustomFields(typeDefs, customFields);
    }
}

/**
 * Copied directly from Nest's GraphQLFactory source, since there is currently an issue
 * with injecting the service itself. See https://github.com/nestjs/graphql/issues/52
 * TODO: These 2 functions rely on transitive dep (of @nestjs/graphql) and are just a
 * temp fix until the issue linked above is resolved.
 */
function mergeTypesByPaths(...pathsToTypes: string[]): string {
    return mergeTypes(flatten(pathsToTypes.map(pattern => loadFiles(pattern))));
}

function loadFiles(pattern: string): any[] {
    const paths = glob.sync(pattern);
    return paths.map(p => fs.readFileSync(p, 'utf8'));
}
