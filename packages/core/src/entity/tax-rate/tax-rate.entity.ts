import { TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { idsAreEqual } from '../../common/utils';
import { VendureEntity } from '../base/base.entity';
import { CustomerGroup } from '../customer-group/customer-group.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { DecimalTransformer } from '../value-transformers';
import { Zone } from '../zone/zone.entity';

/**
 * @description
 * A TaxRate defines the rate of tax to apply to a {@link ProductVariant} based on three factors:
 *
 * 1. the ProductVariant's {@link TaxCategory}
 * 2. the applicable {@link Zone} ("applicable" being defined by the configured {@link TaxZoneStrategy})
 * 3. the {@link CustomerGroup} of the current Customer
 *
 * @docsCategory entities
 */
@Entity()
export class TaxRate extends VendureEntity {
    constructor(input?: DeepPartial<TaxRate>) {
        super(input);
    }

    @Column() name: string;

    @Column() enabled: boolean;

    @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() }) value: number;

    @ManyToOne(type => TaxCategory)
    category: TaxCategory;

    @ManyToOne(type => Zone)
    zone: Zone;

    @ManyToOne(type => CustomerGroup, { nullable: true })
    customerGroup?: CustomerGroup;

    /**
     * Returns the tax component of a given gross price.
     */
    taxComponentOf(grossPrice: number): number {
        return Math.round(grossPrice - grossPrice / ((100 + this.value) / 100));
    }

    /**
     * Given a gross (tax-inclusive) price, returns the net price.
     */
    netPriceOf(grossPrice: number): number {
        return grossPrice - this.taxComponentOf(grossPrice);
    }

    /**
     * Returns the tax applicable to the given net price.
     */
    taxPayableOn(netPrice: number): number {
        return Math.round(netPrice * (this.value / 100));
    }

    /**
     * Given a net price, return the gross price (net + tax)
     */
    grossPriceOf(netPrice: number): number {
        return netPrice + this.taxPayableOn(netPrice);
    }

    apply(price: number): TaxLine {
        return {
            description: this.name,
            taxRate: this.value,
            amount: this.taxPayableOn(price),
        };
    }

    test(zone: Zone, taxCategory: TaxCategory): boolean {
        return idsAreEqual(taxCategory.id, this.category.id) && idsAreEqual(zone.id, this.zone.id);
    }
}
