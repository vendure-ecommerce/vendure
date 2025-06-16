import { OnApplicationBootstrap } from '@nestjs/common';
import {
    LanguageCode,
    PluginCommonModule,
    Product,
    ProductVariant,
    RequestContextService,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import path from 'path';

import { adminApiExtensions, shopApiExtensions } from './api/api-extensions';
import { ProductEntityResolver } from './api/product-entity.resolver';
import { ProductReviewAdminResolver } from './api/product-review-admin.resolver';
import { ProductReviewEntityResolver } from './api/product-review-entity.resolver';
import { ProductReviewShopResolver } from './api/product-review-shop.resolver';
import { ProductReviewTranslation } from './entities/product-review-translation.entity';
import { ProductReview } from './entities/product-review.entity';
import { ReviewState } from './types';

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
    configuration: config => {
        config.customFields.Product.push({
            name: 'reviewRating',
            label: [{ languageCode: LanguageCode.en, value: 'Review rating' }],
            public: true,
            nullable: true,
            type: 'float',
            ui: { tab: 'Reviews', component: 'star-rating-form-input' },
        });
        config.customFields.Product.push({
            name: 'reviewCount',
            label: [{ languageCode: LanguageCode.en, value: 'Review count' }],
            public: true,
            defaultValue: 0,
            type: 'float',
            ui: { tab: 'Reviews', component: 'review-count-link' },
        });
        config.customFields.Product.push({
            name: 'featuredReview',
            label: [{ languageCode: LanguageCode.en, value: 'Featured review' }],
            public: true,
            type: 'relation',
            entity: ProductReview,
            ui: { tab: 'Reviews', component: 'review-selector-form-input' },
            inverseSide: undefined,
        });
        config.customFields.ProductReview = [
            {
                type: 'string',
                name: 'reviewerName',
                label: [{ languageCode: LanguageCode.en, value: 'Reviewer name' }],
                public: true,
                nullable: true,
            },
        ];
        return config;
    },
    dashboard: './dashboard/index.tsx',
})
export class ReviewsPlugin implements OnApplicationBootstrap {
    constructor(
        private readonly connection: TransactionalConnection,
        private readonly requestContextService: RequestContextService,
    ) {}

    static uiExtensions: AdminUiExtension = {
        extensionPath: path.join(__dirname, 'ui'),
        routes: [{ route: 'product-reviews', filePath: 'routes.ts' }],
        providers: ['providers.ts'],
    };

    async onApplicationBootstrap() {
        const ctx = await this.requestContextService.create({
            apiType: 'admin',
            languageCode: LanguageCode.en,
        });
        const reviewCount = await this.connection.getRepository(ctx, ProductReview).count();

        if (reviewCount === 0) {
            const products = await this.connection.getRepository(ctx, Product).find();
            if (products.length === 0) {
                return;
            }

            const demoReviews = [
                {
                    summary: 'Great product, highly recommend!',
                    body: 'I was really impressed with the quality and performance. Would definitely buy again.',
                    rating: 5,
                    authorName: 'John Smith',
                    authorLocation: 'New York, USA',
                    state: 'approved',
                    customFields: {
                        reviewerName: 'JSmith123',
                    },
                },
                {
                    summary: 'Good value for money',
                    body: 'Does exactly what it says. No complaints.',
                    rating: 4,
                    authorName: 'Sarah Wilson',
                    authorLocation: 'London, UK',
                    state: 'approved',
                    customFields: {
                        reviewerName: 'SarahW',
                    },
                },
                {
                    summary: 'Decent but could be better',
                    body: 'The product is okay but there is room for improvement in terms of durability.',
                    rating: 3,
                    authorName: 'Mike Johnson',
                    authorLocation: 'Toronto, Canada',
                    state: 'approved',
                    customFields: {
                        reviewerName: 'MikeJ',
                    },
                },
                {
                    summary: 'Exceeded expectations',
                    body: 'Really happy with this purchase. The quality is outstanding.',
                    rating: 5,
                    authorName: 'Emma Brown',
                    authorLocation: 'Sydney, Australia',
                    state: 'approved',
                    customFields: {
                        reviewerName: 'EmmaB',
                    },
                },
                {
                    summary: 'Good product, fast delivery',
                    body: 'Product arrived quickly and works as described. Happy with the purchase.',
                    rating: 4,
                    authorName: 'David Lee',
                    authorLocation: 'Singapore',
                    state: 'approved',
                    customFields: {
                        reviewerName: 'DavidL',
                    },
                },
            ];

            for (const review of demoReviews) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const productVariants = await this.connection.getRepository(ctx, ProductVariant).find({
                    where: { productId: randomProduct.id },
                });
                const randomVariant = productVariants[Math.floor(Math.random() * productVariants.length)];

                await this.connection.getRepository(ctx, ProductReview).save({
                    ...review,
                    state: review.state as ReviewState,
                    product: randomProduct,
                    productVariant: randomVariant,
                });
            }
        }
    }
}
