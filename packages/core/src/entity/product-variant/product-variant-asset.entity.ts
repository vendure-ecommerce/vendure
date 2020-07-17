import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { OrderableAsset } from '../asset/orderable-asset.entity';

import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantAsset extends OrderableAsset {
    constructor(input?: DeepPartial<ProductVariantAsset>) {
        super(input);
    }
    @Column()
    productVariantId: ID;

    @ManyToOne((type) => ProductVariant, (variant) => variant.assets, { onDelete: 'CASCADE' })
    productVariant: ProductVariant;
}
