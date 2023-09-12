/* eslint-disable @typescript-eslint/no-unused-vars */
import { Customer, DeepPartial, Product, ProductVariant, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';

import { ReviewState } from '../types';

@Entity()
export class ProductReview extends VendureEntity {
    constructor(input?: DeepPartial<ProductReview>) {
        super(input);
    }

    @ManyToOne(type => Product)
    product: Product;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant | null;

    @Column()
    summary: string;

    @Column('text')
    body: string;

    @Column()
    rating: number;

    @ManyToOne(type => Customer)
    author: Customer;

    @Column()
    authorName: string;

    @Column({ nullable: true })
    authorLocation: string;

    @Column({ default: 0 })
    upvotes: number;

    @Column({ default: 0 })
    downvotes: number;

    @Column('varchar')
    state: ReviewState;

    @Column('text', { nullable: true, default: null })
    response: string;

    @Column({ nullable: true, default: null })
    responseCreatedAt: Date;
}
