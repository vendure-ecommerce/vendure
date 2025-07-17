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
import { Observable } from 'rxjs';

import { ConfigService } from '../../config/config.service';
import { parseContext } from '../common/parse-context';

/**
 * @description
 * Applies default values to custom fields when they are explicitly set to null in GraphQL create mutations.
 * This interceptor runs before the validation interceptor and modifies the input variables
 * to replace null values with their configured default values.
 *
 * Note: This only applies to Create operations, not Update operations, to avoid interfering
 * with validation of null values during updates (e.g., when updating a non-nullable field to null
 * should properly throw a validation error).
 */
@Injectable()
export class ApplyCustomFieldDefaultsInterceptor implements NestInterceptor {
    private readonly inputsWithCustomFields = new Set<string>();

    constructor(
        private configService: ConfigService,
        private moduleRef: ModuleRef,
    ) {
        this.inputsWithCustomFields = Object.keys(configService.customFields).reduce((inputs, entityName) => {
            inputs.add(`Create${entityName}Input`);
            // Note: We only apply defaults for Create operations, not Update operations
            // to avoid interfering with validation of null values in updates
            return inputs;
        }, new Set<string>());
        this.inputsWithCustomFields.add('OrderLineCustomFieldsInput');
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const parsedContext = parseContext(context);
        if (parsedContext.isGraphQL) {
            const gqlExecutionContext = GqlExecutionContext.create(context);
            const { operation, schema } = parsedContext.info;
            const variables = gqlExecutionContext.getArgs();

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
                                this.applyDefaultsToInput(typeName, inputVariable);
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
}
