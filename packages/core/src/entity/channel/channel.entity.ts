import { CurrencyCode, LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { CustomChannelFields } from '../custom-entity-fields';
import { EntityId } from '../entity-id.decorator';
import { Seller } from '../seller/seller.entity';
import { Zone } from '../zone/zone.entity';

/**
 * @description
 * A Channel represents a distinct sales channel and configures defaults for that
 * channel.
 *
 * * Set a channel-specific currency, language, tax and shipping defaults
 * * Assign only specific Products to the Channel (with Channel-specific prices)
 * * Create Administrator roles limited to the Channel
 * * Assign only specific StockLocations, Assets, Facets, Collections, Promotions, ShippingMethods & PaymentMethods to the Channel
 * * Have Orders and Customers associated with specific Channels.
 *
 * In Vendure, Channels have a number of different uses, such as:
 *
 * * Multi-region stores, where there is a distinct website for each territory with its own available inventory, pricing, tax and shipping rules.
 * * Creating distinct rules and inventory for different sales channels such as Amazon.
 * * Specialized stores offering a subset of the main inventory.
 * * Implementing multi-vendor marketplace applications.
 *
 * @docsCategory entities
 */
@Entity()
export class Channel extends VendureEntity {
    constructor(input?: DeepPartial<Channel>) {
        super(input);
        if (!input || !input.token) {
            this.token = this.generateToken();
        }
    }

    @Column({ unique: true })
    code: string;

    @Column({ unique: true })
    token: string;

    @Column({ default: '', nullable: true })
    description: string;

    @Index()
    @ManyToOne(type => Seller)
    seller?: Seller;

    @EntityId({ nullable: true })
    sellerId?: ID;

    @Column('varchar') defaultLanguageCode: LanguageCode;

    @Column({ type: 'simple-array', nullable: true })
    availableLanguageCodes: LanguageCode[];

    @Index()
    @ManyToOne(type => Zone)
    defaultTaxZone: Zone;

    @Index()
    @ManyToOne(type => Zone)
    defaultShippingZone: Zone;

    @Column('varchar')
    defaultCurrencyCode: CurrencyCode;

    @Column({ type: 'simple-array', nullable: true })
    availableCurrencyCodes: CurrencyCode[];

    /**
     * @description
     * Specifies the default value for inventory tracking for ProductVariants.
     * Can be overridden per ProductVariant, but this value determines the default
     * if not otherwise specified.
     */
    @Column({ default: true })
    trackInventory: boolean;

    /**
     * @description
     * Specifies the value of stockOnHand at which a given ProductVariant is considered
     * out of stock.
     */
    @Column({ default: 0 })
    outOfStockThreshold: number;

    @Column(type => CustomChannelFields)
    customFields: CustomChannelFields;

    @Column() pricesIncludeTax: boolean;

    private generateToken(): string {
        const randomString = () => Math.random().toString(36).substr(3, 10);
        return `${randomString()}${randomString()}`;
    }
}
