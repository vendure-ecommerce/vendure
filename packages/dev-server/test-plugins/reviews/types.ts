import { ProductReview } from './entities/product-review.entity';

export type ReviewState = 'new' | 'approved' | 'rejected';

declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomProductFields {
        reviewCount: number;
        reviewRating: number;
        featuredReview?: ProductReview;
    }
}
