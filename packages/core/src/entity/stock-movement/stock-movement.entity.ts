import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

/**
 * @description
 * A StockMovement is created whenever stock of a particular ProductVariant goes in
 * or out.
 *
 * @docsCategory entities
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class StockMovement extends VendureEntity {
    @Column({ nullable: false })
    type: string;

    @ManyToOne(type => ProductVariant, variant => variant.stockMovements)
    productVariant: ProductVariant;

    @Column()
    quantity: number;
}
