import { Injectable } from '@nestjs/common';
import { ConfigurableOperationInput } from '@vendure/common/lib/generated-types';
import { Type } from '@vendure/common/lib/shared-types';

import { ConfigurableOperation } from '../../../../../common/lib/generated-types';
import { ConfigurableOperationDef } from '../../../common/configurable-operation';
import { UserInputError } from '../../../common/error/errors';
import { CollectionFilter } from '../../../config/catalog/collection-filter';
import { ConfigService } from '../../../config/config.service';
import { FulfillmentHandler } from '../../../config/fulfillment/fulfillment-handler';
import { PaymentMethodHandler } from '../../../config/payment-method/payment-method-handler';
import { PromotionAction } from '../../../config/promotion/promotion-action';
import { PromotionCondition } from '../../../config/promotion/promotion-condition';
import { ShippingCalculator } from '../../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../../config/shipping-method/shipping-eligibility-checker';

export type ConfigDefTypeMap = {
    CollectionFilter: CollectionFilter;
    FulfillmentHandler: FulfillmentHandler;
    PaymentMethodHandler: PaymentMethodHandler;
    PromotionAction: PromotionAction;
    PromotionCondition: PromotionCondition;
    ShippingCalculator: ShippingCalculator;
    ShippingEligibilityChecker: ShippingEligibilityChecker;
};

export type ConfigDefType = keyof ConfigDefTypeMap;

/**
 * This helper class provides methods relating to ConfigurableOperationDef instances.
 */
@Injectable()
export class ConfigArgService {
    private readonly definitionsByType: { [K in ConfigDefType]: Array<ConfigDefTypeMap[K]> };

    constructor(private configService: ConfigService) {
        this.definitionsByType = {
            CollectionFilter: this.configService.catalogOptions.collectionFilters,
            FulfillmentHandler: this.configService.shippingOptions.fulfillmentHandlers,
            PaymentMethodHandler: this.configService.paymentOptions.paymentMethodHandlers,
            PromotionAction: this.configService.promotionOptions.promotionActions,
            PromotionCondition: this.configService.promotionOptions.promotionConditions,
            ShippingCalculator: this.configService.shippingOptions.shippingCalculators,
            ShippingEligibilityChecker: this.configService.shippingOptions.shippingEligibilityCheckers,
        };
    }

    getDefinitions<T extends ConfigDefType>(defType: T): Array<ConfigDefTypeMap[T]> {
        return this.definitionsByType[defType] as Array<ConfigDefTypeMap[T]>;
    }

    getByCode<T extends ConfigDefType>(defType: T, code: string): ConfigDefTypeMap[T] {
        const defsOfType = this.getDefinitions(defType);
        const match = defsOfType.find(def => def.code === code);
        if (!match) {
            throw new UserInputError(`error.no-configurable-operation-def-with-code-found`, {
                code,
                type: defType,
            });
        }
        return match as ConfigDefTypeMap[T];
    }

    /**
     * Parses and validates the input to a ConfigurableOperation.
     */
    parseInput(defType: ConfigDefType, input: ConfigurableOperationInput): ConfigurableOperation {
        const match = this.getByCode(defType, input.code);
        this.validateRequiredFields(input, match);
        return {
            code: input.code,
            args: input.arguments,
        };
    }

    private parseOperationArgs(
        input: ConfigurableOperationInput,
        checkerOrCalculator: ShippingEligibilityChecker | ShippingCalculator,
    ): ConfigurableOperation {
        const output: ConfigurableOperation = {
            code: input.code,
            args: input.arguments,
        };
        return output;
    }

    private validateRequiredFields(input: ConfigurableOperationInput, def: ConfigurableOperationDef) {
        for (const [name, argDef] of Object.entries(def.args)) {
            if (argDef.required) {
                const inputArg = input.arguments.find(a => a.name === name);
                let val: unknown;
                if (inputArg) {
                    try {
                        val = JSON.parse(inputArg?.value);
                    } catch (e) {
                        // ignore
                    }
                }
                if (val == null) {
                    throw new UserInputError('error.configurable-argument-is-required', {
                        name,
                        value: String(val),
                    });
                }
            }
        }
    }
}
