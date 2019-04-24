import { CurrencyCode, LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { idType } from '../../config/config-helpers';

@Entity()
export class SearchIndexItem {
    constructor(input?: Partial<SearchIndexItem>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value;
            }
        }
    }

    @PrimaryColumn({ type: idType() })
    productVariantId: ID;

    @PrimaryColumn('varchar')
    languageCode: LanguageCode;

    @Column({ type: idType() })
    productId: ID;

    @Column()
    enabled: boolean;

    @Index({ fulltext: true })
    @Column()
    productName: string;

    @Index({ fulltext: true })
    @Column()
    productVariantName: string;

    @Index({ fulltext: true })
    @Column('text')
    description: string;

    @Column()
    slug: string;

    @Column()
    sku: string;

    @Column()
    price: number;

    @Column()
    priceWithTax: number;

    currencyCode: CurrencyCode;

    @Column('simple-array')
    facetIds: string[];

    @Column('simple-array')
    facetValueIds: string[];

    @Column('simple-array')
    collectionIds: string[];

    @Column()
    productPreview: string;

    @Column()
    productVariantPreview: string;
}
