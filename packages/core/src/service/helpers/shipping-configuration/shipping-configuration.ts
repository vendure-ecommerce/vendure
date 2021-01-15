import { Injectable } from '@nestjs/common';
import { ConfigurableOperationInput } from '@vendure/common/lib/generated-types';

import { ConfigurableOperation } from '../../../../../common/lib/generated-types';
import { UserInputError } from '../../../common/error/errors';
import { ConfigService } from '../../../config/config.service';
import { FulfillmentHandler } from '../../../config/fulfillment/fulfillment-handler';
import { ShippingCalculator } from '../../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../../config/shipping-method/shipping-eligibility-checker';

/**
 * This helper class provides methods relating to ShippingMethod configurable operations (eligibility checkers, calculators
 * and fulfillment handlers).
 */
@Injectable()
export class ShippingConfiguration {
    readonly shippingEligibilityCheckers: ShippingEligibilityChecker[];
    readonly shippingCalculators: ShippingCalculator[];
    readonly fulfillmentHandlers: FulfillmentHandler[];

    constructor(private configService: ConfigService) {
        this.shippingEligibilityCheckers =
            this.configService.shippingOptions.shippingEligibilityCheckers || [];
        this.shippingCalculators = this.configService.shippingOptions.shippingCalculators || [];
        this.fulfillmentHandlers = this.configService.shippingOptions.fulfillmentHandlers || [];
    }

    parseCheckerInput(input: ConfigurableOperationInput): ConfigurableOperation {
        const checker = this.getChecker(input.code);
        return this.parseOperationArgs(input, checker);
    }

    parseCalculatorInput(input: ConfigurableOperationInput): ConfigurableOperation {
        const calculator = this.getCalculator(input.code);
        return this.parseOperationArgs(input, calculator);
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

    private getChecker(code: string): ShippingEligibilityChecker {
        const match = this.shippingEligibilityCheckers.find(a => a.code === code);
        if (!match) {
            throw new UserInputError(`error.shipping-eligibility-checker-with-code-not-found`, { code });
        }
        return match;
    }

    private getCalculator(code: string): ShippingCalculator {
        const match = this.shippingCalculators.find(a => a.code === code);
        if (!match) {
            throw new UserInputError(`error.shipping-calculator-with-code-not-found`, { code });
        }
        return match;
    }
}
