import { paramCase } from 'change-case';

import { TemplateContext } from '../../types';

export function renderService(context: TemplateContext) {
    return /* language=TypeScript */ `
import { Inject, Injectable } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';

import { ${context.pluginInitOptionsName} } from '../constants';
import { PluginInitOptions } from '../types';

@Injectable()
export class ${context.service.className} {
    constructor(
        private connection: TransactionalConnection,
        @Inject(${context.pluginInitOptionsName}) private options: PluginInitOptions,
    ) {}

    async exampleMethod(
        ctx: RequestContext,
        options?: { input?: string },
    ): Promise<string> {
        return options?.input ? 'Hello \${options.input}' : 'Hello World';
    }
}
`;
}

export function renderServiceWithEntity(context: TemplateContext) {
    return /* language=TypeScript */ `
import { Inject, Injectable } from '@nestjs/common';
import { ListQueryBuilder, ListQueryOptions, PaginatedList, RequestContext, TransactionalConnection } from '@vendure/core';

import { ${context.customEntityName} } from '../entities/${context.entity.fileName}';
import { ${context.pluginInitOptionsName} } from '../constants';
import { PluginInitOptions } from '../types';

// TODO: Set up graphql-code-generator to generate the types for the following inputs
type Create${context.customEntityName}Input = any;
type Update${context.customEntityName}Input = any;

@Injectable()
export class ${context.service.className} {
    constructor(
        private connection: TransactionalConnection,
        @Inject(${context.pluginInitOptionsName}) private options: PluginInitOptions,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<${context.customEntityName}>,
    ): Promise<PaginatedList<${context.customEntityName}>> {
        return this.listQueryBuilder
            .build(${context.customEntityName}, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async findOne(ctx: RequestContext, id: string): Promise<${context.customEntityName} | null> {
        return this.connection.getRepository(ctx, ${context.customEntityName}).findOne({ where: { id } });
    }

    async create(ctx: RequestContext, input: Create${context.customEntityName}Input): Promise<${context.customEntityName}> {
        return this.connection.getRepository(ctx, ${context.customEntityName}).save(new ${context.customEntityName}(input));
    }

    async update(ctx: RequestContext, input: Update${context.customEntityName}Input): Promise<${context.customEntityName}> {
        const example = await this.connection.getEntityOrThrow(ctx, ${context.customEntityName}, input.id);
        const updated = { ...example, ...input };
        return this.connection.getRepository(ctx, ${context.customEntityName}).save(updated);
    }
}
`;
}
