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
import { ShippingCalculator } from '../../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../../config/shipping-method/shipping-eligibility-checker';

export type ConfigDefType =
    | 'CollectionFilter'
    | 'FulfillmentHandler'
    | 'PaymentMethodHandler'
    | 'PromotionAction'
    | 'PromotionCondition'
    | 'ShippingCalculator'
    | 'ShippingEligibilityChecker';

/**
 * This helper class provides methods relating to ConfigurableOperationDef instances.
 */
@Injectable()
export class ConfigArgService {
    private readonly definitionsByType: { [K in ConfigDefType]: ConfigurableOperationDef[] };

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

    getDefinitions(defType: ConfigDefType): ConfigurableOperationDef[] {
        return this.definitionsByType[defType];
    }

    parseInput(defType: ConfigDefType, input: ConfigurableOperationInput): ConfigurableOperation {
        const defsOfType = this.definitionsByType[defType];
        const match = defsOfType.find(def => def.code === input.code);
        if (!match) {
            throw new UserInputError(`error.no-configurable-operation-def-with-code-found`, {
                code: input.code,
                type: defType,
            });
        }
        return {
            code: input.code,
            args: input.arguments,
        };
    }

    /**
     * Converts the input values of the "create" and "update" mutations into the format expected by the ShippingMethod entity.
     */
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
}
