import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './ProductVariant';

@Entity()
export class Product {
    @PrimaryGeneratedColumn() id: number;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @Column() image: string;

    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: string;
}
