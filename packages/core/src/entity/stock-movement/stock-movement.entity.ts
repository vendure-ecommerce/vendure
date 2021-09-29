import { StockMovementType } from '@vendure/common/lib/generated-types';
import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

/**
 * @description
 * A StockMovement is created whenever stock of a particular ProductVariant goes in
 * or out.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 * @docsWeight 0
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'discriminator' } })
export abstract class StockMovement extends VendureEntity {
    @Column({ nullable: false, type: 'varchar' })
    readonly type: StockMovementType;

    @ManyToOne(type => ProductVariant, variant => variant.stockMovements)
    productVariant: ProductVariant;

    @Column()
    quantity: number;
}
