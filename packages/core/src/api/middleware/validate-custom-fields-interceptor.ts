import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { getGraphQlInputName } from '@vendure/common/lib/shared-utils';
import {
    GraphQLInputType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
    OperationDefinitionNode,
    TypeNode,
} from 'graphql';

import { REQUEST_CONTEXT_KEY } from '../../common/constants';
import { Injector } from '../../common/injector';
import { ConfigService } from '../../config/config.service';
import { CustomFieldConfig, CustomFields } from '../../config/custom-field/custom-field-types';
import { parseContext } from '../common/parse-context';
import { RequestContext } from '../common/request-context';
import { validateCustomFieldValue } from '../common/validate-custom-field-value';

/**
 * This interceptor is responsible for enforcing the validation constraints defined for any CustomFields.
 * For example, if a custom 'int' field has a "min" value of 0, and a mutation attempts to set its value
 * to a negative integer, then that mutation will fail with an error.
 */
@Injectable()
export class ValidateCustomFieldsInterceptor implements NestInterceptor {
    private readonly inputsWithCustomFields: Set<string>;

    constructor(private configService: ConfigService, private moduleRef: ModuleRef) {
        this.inputsWithCustomFields = Object.keys(configService.customFields).reduce((inputs, entityName) => {
            inputs.add(`Create${entityName}Input`);
            inputs.add(`Update${entityName}Input`);
            return inputs;
        }, new Set<string>());
        this.inputsWithCustomFields.add('OrderLineCustomFieldsInput');
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const parsedContext = parseContext(context);
        const injector = new Injector(this.moduleRef);
        if (parsedContext.isGraphQL) {
            const gqlExecutionContext = GqlExecutionContext.create(context);
            const { operation, schema } = parsedContext.info;
            const variables = gqlExecutionContext.getArgs();
            const ctx: RequestContext = (parsedContext.req as any)[REQUEST_CONTEXT_KEY];

            if (operation.operation === 'mutation') {
                const inputTypeNames = this.getArgumentMap(operation, schema);
                for (const [inputName, typeName] of Object.entries(inputTypeNames)) {
                    if (this.inputsWithCustomFields.has(typeName)) {
                        if (variables[inputName]) {
                            const inputVariables: Array<Record<string, any>> = Array.isArray(
                                variables[inputName],
                            )
                                ? variables[inputName]
                                : [variables[inputName]];

                            for (const inputVariable of inputVariables) {
                                await this.validateInput(typeName, ctx, injector, inputVariable);
                            }
                        }
                    }
                }
            }
        }
        return next.handle();
    }

    private async validateInput(
        typeName: string,
        ctx: RequestContext,
        injector: Injector,
        variableValues?: { [key: string]: any },
    ) {
        if (variableValues) {
            const entityName = typeName.replace(/(Create|Update)(.+)Input/, '$2');
            const customFieldConfig = this.configService.customFields[entityName as keyof CustomFields];
            if (typeName === 'OrderLineCustomFieldsInput') {
                // special case needed to handle custom fields passed via addItemToOrder or adjustOrderLine
                // mutations.
                await this.validateCustomFieldsObject(
                    this.configService.customFields.OrderLine,
                    ctx,
                    variableValues,
                    injector,
                );
            }
            if (variableValues.customFields) {
                await this.validateCustomFieldsObject(
                    customFieldConfig,
                    ctx,
                    variableValues.customFields,
                    injector,
                );
            }
            const translations = variableValues.translations;
            if (Array.isArray(translations)) {
                for (const translation of translations) {
                    if (translation.customFields) {
                        await this.validateCustomFieldsObject(
                            customFieldConfig,
                            ctx,
                            translation.customFields,
                            injector,
                        );
                    }
                }
            }
        }
    }

    private async validateCustomFieldsObject(
        customFieldConfig: CustomFieldConfig[],
        ctx: RequestContext,
        customFieldsObject: { [key: string]: any },
        injector: Injector,
    ) {
        for (const [key, value] of Object.entries(customFieldsObject)) {
            const config = customFieldConfig.find(c => getGraphQlInputName(c) === key);
            if (config) {
                await validateCustomFieldValue(config, value, injector, ctx);
            }
        }
    }

    private getArgumentMap(
        operation: OperationDefinitionNode,
        schema: GraphQLSchema,
    ): { [inputName: string]: string } {
        const mutationType = schema.getMutationType();
        if (!mutationType) {
            return {};
        }
        const map: { [inputName: string]: string } = {};

        for (const selection of operation.selectionSet.selections) {
            if (selection.kind === 'Field') {
                const name = selection.name.value;

                const inputType = mutationType.getFields()[name];
                if (!inputType) continue;

                for (const arg of inputType.args) {
                    map[arg.name] = this.getInputTypeName(arg.type);
                }
            }
        }
        return map;
    }

    private getNamedTypeName(type: TypeNode): string {
        if (type.kind === 'NonNullType' || type.kind === 'ListType') {
            return this.getNamedTypeName(type.type);
        } else {
            return type.name.value;
        }
    }

    private getInputTypeName(type: GraphQLInputType): string {
        if (type instanceof GraphQLNonNull) {
            return this.getInputTypeName(type.ofType);
        }
        if (type instanceof GraphQLList) {
            return this.getInputTypeName(type.ofType);
        }
        return type.name;
    }
}
