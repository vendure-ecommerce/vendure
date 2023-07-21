import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../../api';
import { TtlCache } from '../../../common/ttl-cache';
import { idsAreEqual } from '../../../common/utils';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';

/**
 * @description
 * The FacetValueChecker is a helper class used to determine whether a given OrderLine consists
 * of ProductVariants containing the given FacetValues.
 *
 * @example
 * ```ts
 * import { FacetValueChecker, LanguageCode, PromotionCondition, TransactionalConnection } from '\@vendure/core';
 *
 * let facetValueChecker: FacetValueChecker;
 *
 * export const hasFacetValues = new PromotionCondition({
 *   code: 'at_least_n_with_facets',
 *   description: [
 *     { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
 *   ],
 *   args: {
 *     minimum: { type: 'int' },
 *     facets: { type: 'ID', list: true, ui: { component: 'facet-value-form-input' } },
 *   },
 *   init(injector) {
 *     facetValueChecker = new FacetValueChecker(injector.get(TransactionalConnection));
 *   },
 *   async check(ctx, order, args) {
 *     let matches = 0;
 *     for (const line of order.lines) {
 *       if (await facetValueChecker.hasFacetValues(line, args.facets)) {
 *           matches += line.quantity;
 *       }
 *     }
 *     return args.minimum <= matches;
 *   },
 * });
 * ```
 *
 * @docsCategory Promotions
 */
export class FacetValueChecker {
    private variantCache = new TtlCache<ID, ProductVariant>({ ttl: 5000 });

    constructor(private connection: TransactionalConnection) {}
    /**
     * @description
     * Checks a given {@link OrderLine} against the facetValueIds and returns
     * `true` if the associated {@link ProductVariant} & {@link Product} together
     * have *all* the specified {@link FacetValue}s.
     */
    async hasFacetValues(orderLine: OrderLine, facetValueIds: ID[], ctx?: RequestContext): Promise<boolean> {
        let variant = this.variantCache.get(orderLine.productVariant.id);
        if (!variant) {
            variant = await this.connection
                .getRepository(ctx, ProductVariant)
                .findOne({
                    where: { id: orderLine.productVariant.id },
                    relations: ['product', 'product.facetValues', 'facetValues'],
                })
                .then(result => result ?? undefined);
            if (!variant) {
                return false;
            }
            this.variantCache.set(variant.id, variant);
        }
        const allFacetValues = unique([...variant.facetValues, ...variant.product.facetValues], 'id');
        return facetValueIds.reduce(
            (result, id) => result && !!allFacetValues.find(fv => idsAreEqual(fv.id, id)),
            true as boolean,
        );
    }
}
