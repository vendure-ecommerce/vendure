import { StockMovementType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, TableInheritance } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { StockLocation } from '../stock-location/stock-location.entity';

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

    @Index()
    @ManyToOne(type => ProductVariant, variant => variant.stockMovements)
    productVariant: ProductVariant;

    @Index()
    @ManyToOne(type => StockLocation)
    stockLocation: StockLocation;

    @EntityId()
    stockLocationId: ID;

    @Column()
    quantity: number;
}
