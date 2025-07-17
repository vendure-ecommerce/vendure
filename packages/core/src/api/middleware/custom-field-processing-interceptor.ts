import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getGraphQlInputName } from '@vendure/common/lib/shared-utils';
import {
    GraphQLInputType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
    OperationDefinitionNode,
} from 'graphql';

import { Injector } from '../../common/injector';
import { ConfigService } from '../../config/config.service';
import { CustomFieldConfig, CustomFields } from '../../config/custom-field/custom-field-types';
import { parseContext } from '../common/parse-context';
import { internal_getRequestContext, RequestContext } from '../common/request-context';
import { validateCustomFieldValue } from '../common/validate-custom-field-value';

/**
 * @description
 * Unified interceptor that processes custom fields in GraphQL mutations by:
 *
 * 1. Applying default values when fields are explicitly set to null (create operations only)
 * 2. Validating custom field values according to their constraints
 */
@Injectable()
export class CustomFieldProcessingInterceptor implements NestInterceptor {
    private readonly createInputsWithCustomFields = new Set<string>();
    private readonly updateInputsWithCustomFields = new Set<string>();

    constructor(
        private configService: ConfigService,
        private moduleRef: ModuleRef,
    ) {
        Object.keys(configService.customFields).forEach(entityName => {
            this.createInputsWithCustomFields.add(`Create${entityName}Input`);
            this.updateInputsWithCustomFields.add(`Update${entityName}Input`);
        });
        // Special case for OrderLine custom fields
        this.createInputsWithCustomFields.add('OrderLineCustomFieldsInput');
        this.updateInputsWithCustomFields.add('OrderLineCustomFieldsInput');
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const parsedContext = parseContext(context);
        const injector = new Injector(this.moduleRef);

        if (parsedContext.isGraphQL) {
            const gqlExecutionContext = GqlExecutionContext.create(context);
            const { operation, schema } = parsedContext.info;
            const variables = gqlExecutionContext.getArgs();
            const ctx = internal_getRequestContext(parsedContext.req);

            if (operation.operation === 'mutation') {
                const inputTypeNames = this.getArgumentMap(operation, schema);

                for (const [inputName, typeName] of Object.entries(inputTypeNames)) {
                    const isCreateInput = this.createInputsWithCustomFields.has(typeName);
                    const isUpdateInput = this.updateInputsWithCustomFields.has(typeName);

                    if (isCreateInput || isUpdateInput) {
                        if (variables[inputName]) {
                            const inputVariables: Array<Record<string, any>> = Array.isArray(
                                variables[inputName],
                            )
                                ? variables[inputName]
                                : [variables[inputName]];

                            for (const inputVariable of inputVariables) {
                                // Step 1: Apply defaults (only for create operations)
                                if (isCreateInput) {
                                    this.applyDefaultsToInput(typeName, inputVariable);
                                }

                                // Step 2: Validate custom fields
                                await this.validateInput(typeName, ctx, injector, inputVariable);
                            }
                        }
                    }
                }
            }
        }
        return next.handle();
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

    private getInputTypeName(type: GraphQLInputType): string {
        if (type instanceof GraphQLNonNull) {
            return this.getInputTypeName(type.ofType);
        }
        if (type instanceof GraphQLList) {
            return this.getInputTypeName(type.ofType);
        }
        return type.name;
    }

    private applyDefaultsToInput(typeName: string, variableValues: any) {
        if (typeName === 'OrderLineCustomFieldsInput') {
            // Special case for OrderLine custom fields
            this.applyDefaultsToCustomFieldsObject(
                this.configService.customFields.OrderLine || [],
                variableValues,
            );
        } else {
            // Extract entity name from input type (e.g., "CreateProductInput" -> "Product")
            const entityName = this.getEntityNameFromInputType(typeName);
            const customFieldConfig = this.configService.customFields[entityName];

            if (customFieldConfig) {
                // Apply defaults to direct custom fields
                if (variableValues.customFields) {
                    this.applyDefaultsToCustomFieldsObject(customFieldConfig, variableValues.customFields);
                }

                // Apply defaults to translation custom fields
                if (variableValues.translations && Array.isArray(variableValues.translations)) {
                    for (const translation of variableValues.translations) {
                        if (translation.customFields) {
                            this.applyDefaultsToCustomFieldsObject(
                                customFieldConfig,
                                translation.customFields,
                            );
                        }
                    }
                }
            }
        }
    }

    private applyDefaultsToCustomFieldsObject(customFieldConfig: any[], customFieldsObject: any) {
        for (const config of customFieldConfig) {
            const fieldName = getGraphQlInputName(config);
            // Only apply default if the field is explicitly null and has a default value
            if (customFieldsObject[fieldName] === null && config.defaultValue !== undefined) {
                customFieldsObject[fieldName] = config.defaultValue;
            }
        }
    }

    private getEntityNameFromInputType(typeName: string): string {
        // Remove "Create" or "Update" prefix and "Input" suffix
        // e.g., "CreateProductInput" -> "Product", "UpdateCustomerInput" -> "Customer"
        if (typeName.startsWith('Create')) {
            return typeName.slice(6, -5); // Remove "Create" and "Input"
        }
        if (typeName.startsWith('Update')) {
            return typeName.slice(6, -5); // Remove "Update" and "Input"
        }
        return typeName;
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
}
