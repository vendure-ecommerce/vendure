import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Field, ID, ObjectType} from 'type-graphql';
import {ProductVariant} from './ProductVariant';

@ObjectType()
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    slug: string;

    @Column()
    @Field()
    description: string;

    @Column()
    @Field()
    image: string;

    @Field()
    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: string;
}

