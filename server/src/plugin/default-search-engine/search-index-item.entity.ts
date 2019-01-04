import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { LanguageCode } from '../../../../shared/generated-types';
import { ID } from '../../../../shared/shared-types';
import { idType } from '../../config/config-helpers';

@Entity()
export class SearchIndexItem {
    constructor(input?: Partial<SearchIndexItem>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                this[key] = value;
            }
        }
    }

    @PrimaryColumn({ type: idType() })
    productVariantId: ID;

    @PrimaryColumn('varchar')
    languageCode: LanguageCode;

    @Column({ type: idType() })
    productId: ID;

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
    sku: string;

    @Column('simple-array')
    facetIds: string[];

    @Column('simple-array')
    facetValueIds: string[];

    @Column()
    productPreview: string;

    @Column()
    productVariantPreview: string;
}
