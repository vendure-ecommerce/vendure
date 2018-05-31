import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';

@Entity()
export class ProductVariant {
    @PrimaryGeneratedColumn() id: number;

    @Column() sku: string;

    @Column() name: string;

    @Column() image: string;

    @Column() price: string;

    @ManyToOne(type => Product, product => product.variants)
    product: Product[];
}
