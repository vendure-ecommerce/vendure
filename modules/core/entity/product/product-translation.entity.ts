import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from '../../locale/locale-types';
import { ProductEntity } from './product.entity';
import { Product } from './product.interface';

@Entity('product_translation')
export class ProductTranslationEntity implements Translation<Product> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: string;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @ManyToOne(type => ProductEntity, base => base.translations)
    base: ProductEntity;
}
