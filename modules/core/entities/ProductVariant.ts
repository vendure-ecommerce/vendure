import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Field, ID, ObjectType} from 'type-graphql';
import {Product} from './Product';

@ObjectType()
@Entity()
export class ProductVariant {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    sku: string;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    image: string;

    @Column()
    @Field()
    price: string;

    @Field(type => [Product])
    @ManyToOne(type => Product, product => product.variants)
    product: Product[]
}
