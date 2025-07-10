import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { adminApiExtensions, shopApiExtensions } from './api/api-extensions';
import { ProductEntityResolver } from './api/product-entity.resolver';
import { ProductReviewAdminResolver } from './api/product-review-admin.resolver';
import { ProductReviewEntityResolver } from './api/product-review-entity.resolver';
import { ProductReviewShopResolver } from './api/product-review-shop.resolver';
import { ProductReviewTranslation } from './entities/product-review-translation.entity';
import { ProductReview } from './entities/product-review.entity';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [ProductReview, ProductReviewTranslation],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [ProductEntityResolver, ProductReviewAdminResolver, ProductReviewEntityResolver],
    },
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [ProductEntityResolver, ProductReviewShopResolver, ProductReviewEntityResolver],
    },
    dashboard: './dashboard/index.tsx',
})
export class ReviewsPlugin {}
