import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    GraphQLInputType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
    OperationDefinitionNode,
    TypeNode,
} from 'graphql';

import { REQUEST_CONTEXT_KEY } from '../../common/constants';
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

    constructor(private configService: ConfigService) {
        this.inputsWithCustomFields = Object.keys(configService.customFields).reduce((inputs, entityName) => {
            inputs.add(`Create${entityName}Input`);
            inputs.add(`Update${entityName}Input`);
            return inputs;
        }, new Set<string>());
    }

    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const parsedContext = parseContext(context);
        if (parsedContext.isGraphQL) {
            const gqlExecutionContext = GqlExecutionContext.create(context);
            const { operation, schema } = parsedContext.info;
            const variables = gqlExecutionContext.getArgs();
            const ctx: RequestContext = (parsedContext.req as any)[REQUEST_CONTEXT_KEY];

            if (operation.operation === 'mutation') {
                const inputTypeNames = this.getArgumentMap(operation, schema);
                Object.entries(inputTypeNames).forEach(([inputName, typeName]) => {
                    if (this.inputsWithCustomFields.has(typeName)) {
                        if (variables[inputName]) {
                            this.validateInput(typeName, ctx.languageCode, variables[inputName]);
                        }
                    }
                });
            }
        }
        return next.handle();
    }

    private validateInput(
        typeName: string,
        languageCode: LanguageCode,
        variableValues?: { [key: string]: any },
    ) {
        if (variableValues) {
            const entityName = typeName.replace(/(Create|Update)(.+)Input/, '$2');
            const customFieldConfig = this.configService.customFields[entityName as keyof CustomFields];

            if (variableValues.customFields) {
                this.validateCustomFieldsObject(customFieldConfig, languageCode, variableValues.customFields);
            }
            const translations = variableValues.translations;
            if (Array.isArray(translations)) {
                for (const translation of translations) {
                    if (translation.customFields) {
                        this.validateCustomFieldsObject(
                            customFieldConfig,
                            languageCode,
                            translation.customFields,
                        );
                    }
                }
            }
        }
    }

    private validateCustomFieldsObject(
        customFieldConfig: CustomFieldConfig[],
        languageCode: LanguageCode,
        customFieldsObject: { [key: string]: any },
    ) {
        for (const [key, value] of Object.entries(customFieldsObject)) {
            const config = customFieldConfig.find(c => c.name === key);
            if (config) {
                validateCustomFieldValue(config, value, languageCode);
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
