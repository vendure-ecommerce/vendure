import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Connection } from 'typeorm';

import { TtlCache } from '../../../common/ttl-cache';
import { idsAreEqual } from '../../../common/utils';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';

export class FacetValueChecker {
    private variantCache = new TtlCache<ID, ProductVariant>({ ttl: 5000 });

    constructor(private connection: Connection) {}
    /**
     * @description
     * Checks a given {@link OrderLine} against the facetValueIds and returns
     * `true` if the associated {@link ProductVariant} & {@link Product} together
     * have *all* the specified {@link FacetValue}s.
     */
    async hasFacetValues(orderLine: OrderLine, facetValueIds: ID[]): Promise<boolean> {
        let variant = this.variantCache.get(orderLine.productVariant.id);
        if (!variant) {
            variant = await this.connection
                .getRepository(ProductVariant)
                .findOne(orderLine.productVariant.id, {
                    relations: ['product', 'product.facetValues', 'facetValues'],
                });
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
