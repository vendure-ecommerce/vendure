import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    Allow,
    Ctx,
    ListQueryBuilder,
    patchEntity,
    Permission,
    Product,
    RequestContext,
    Transaction,
    TransactionalConnection,
} from '@vendure/core';

import { ProductReview } from '../entities/product-review.entity';
import {
    MutationApproveProductReviewArgs,
    MutationRejectProductReviewArgs,
    MutationUpdateProductReviewArgs,
    QueryProductReviewArgs,
    QueryProductReviewsArgs,
} from '../generated-admin-types';

@Resolver()
export class ProductReviewAdminResolver {
    constructor(private connection: TransactionalConnection, private listQueryBuilder: ListQueryBuilder) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    async productReviews(@Ctx() ctx: RequestContext, @Args() args: QueryProductReviewsArgs) {
        return this.listQueryBuilder
            .build(ProductReview, args.options || undefined, {
                relations: ['product'],
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async productReview(@Ctx() ctx: RequestContext, @Args() args: QueryProductReviewArgs) {
        return this.connection.getRepository(ctx, ProductReview).findOne({
            where: { id: args.id },
            relations: {
                author: true,
                product: true,
                productVariant: true,
            },
        });
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateProductReview(
        @Ctx() ctx: RequestContext,
        @Args() { input }: MutationUpdateProductReviewArgs,
    ) {
        const review = await this.connection.getEntityOrThrow(ctx, ProductReview, input.id);
        const originalResponse = review.response;
        const updatedProductReview = patchEntity(review, input);
        if (input.response !== originalResponse) {
            updatedProductReview.responseCreatedAt = new Date();
        }
        return this.connection.getRepository(ctx, ProductReview).save(updatedProductReview);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async approveProductReview(@Ctx() ctx: RequestContext, @Args() { id }: MutationApproveProductReviewArgs) {
        const review = await this.connection.getEntityOrThrow(ctx, ProductReview, id, {
            relations: ['product'],
        });
        if (review.state !== 'new') {
            return review;
        }
        const { product } = review;
        const newRating = this.calculateNewReviewAverage(review.rating, product);
        product.customFields.reviewCount++;
        product.customFields.reviewRating = newRating;
        await this.connection.getRepository(ctx, Product).save(product);
        review.state = 'approved';
        return this.connection.getRepository(ctx, ProductReview).save(review);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async rejectProductReview(@Ctx() ctx: RequestContext, @Args() { id }: MutationRejectProductReviewArgs) {
        const review = await this.connection.getEntityOrThrow(ctx, ProductReview, id);
        if (review.state !== 'new') {
            return review;
        }
        review.state = 'rejected';
        return this.connection.getRepository(ctx, ProductReview).save(review);
    }

    private calculateNewReviewAverage(rating: number, product: Product): number {
        const count = product.customFields.reviewCount;
        const currentRating = product.customFields.reviewRating || 0;
        const newRating = (currentRating * count + rating) / (count + 1);
        return newRating;
    }
}
