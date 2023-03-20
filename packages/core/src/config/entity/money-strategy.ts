import { ColumnOptions } from 'typeorm';

import { InjectableStrategy } from '../../common/types/injectable-strategy';

/**
 * @description
 * The MoneyStrategy defines how monetary values are stored and manipulated. The MoneyStrategy
 * is defined in {@link EntityOptions}:
 *
 * @example
 * ```TypeScript
 * const config: VendureConfig = {
 *   entityOptions: {
 *     moneyStrategy: new MyCustomMoneyStrategy(),
 *   }
 * };
 * ```
 *
 * ## Range
 *
 * The {@link DefaultMoneyStrategy} uses an `int` field in the database, which puts an
 * effective limit of ~21.4 million on any stored value. For certain use cases
 * (e.g. business sales with very high amounts, or currencies with very large
 * denominations), this may cause issues. In this case, you can use the
 * {@link BigIntMoneyStrategy} which will use the `bigint` type to store monetary values,
 * giving an effective upper limit of over 9 quadrillion.
 *
 * ## Precision & rounding
 *
 * Both the `DefaultMoneyStrategy` and `BigIntMoneyStrategy` store monetary values as integers, representing
 * the price in the minor units of the currency (i.e. _cents_ in USD or _pennies_ in GBP).
 *
 * In certain use-cases, it may be required that fractions of a cent or penny be supported. In this case,
 * the solution would be to define a custom MoneyStrategy which uses a non-integer data type for storing
 * the value in the database, and defines a `round()` implementation which allows decimal places to be kept.
 *
 * @docsCategory money
 * @since 2.0.0
 */
export interface MoneyStrategy extends InjectableStrategy {
    /**
     * @description
     * Defines the TypeORM column used to store monetary values.
     */
    readonly moneyColumnOptions: ColumnOptions;

    /**
     * @description
     * Defines the logic used to round monetary values. For instance, the default behavior
     * in the {@link DefaultMoneyStrategy} is to round the value, then multiply.
     *
     * ```TypeScript
     * return Math.round(value) * quantity;
     * ```
     *
     * However, it may be desirable to instead round only _after_ the unit amount has been
     * multiplied. In this case you can define a custom strategy with logic like this:
     *
     * ```TypeScript
     * return Math.round(value * quantity);
     * ```
     */
    round(value: number, quantity?: number): number;
}
