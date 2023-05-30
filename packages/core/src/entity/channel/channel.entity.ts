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

    @Column('simple-array')
    availableLanguageCodes: LanguageCode[];

    @Index()
    @ManyToOne(type => Zone)
    defaultTaxZone: Zone;

    @Index()
    @ManyToOne(type => Zone)
    defaultShippingZone: Zone;

    @Column('varchar')
    defaultCurrencyCode: CurrencyCode;

    @Column('simple-array')
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
