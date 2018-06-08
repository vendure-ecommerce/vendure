import * as faker from 'faker/locale/en_GB';
import { request } from 'graphql-request';
import { CreateProductVariantDto } from '../core/entity/product-variant/create-product-variant.dto';
import { CreateProductDto } from '../core/entity/product/create-product.dto';
import { Product } from '../core/entity/product/product.interface';
import { LanguageCode } from '../core/locale/language-code';
import { LocalizedInput } from '../core/locale/locale-types';

// tslint:disable:no-console
/**
 * A service for creating mock data via the GraphQL API.
 */
export class MockDataClientService {
    async populateProducts(): Promise<any> {
        for (let i = 0; i < 5; i++) {
            const query = `mutation CreateProduct($input: CreateProductInput) {
                            createProduct(input: $input) { id, name }
                           }`;

            const name = faker.commerce.productName();
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const description = faker.lorem.sentence();
            const languageCodes = [LanguageCode.EN, LanguageCode.DE, LanguageCode.ES];

            const variables = {
                input: {
                    image: faker.image.imageUrl(),
                    translations: languageCodes.map(code => this.makeProductTranslation(code, name, slug, description)),
                    variants: [
                        this.makeProductVariant(`${name} Variant 1`, languageCodes),
                        this.makeProductVariant(`${name} Variant 2`, languageCodes),
                    ],
                } as CreateProductDto,
            };

            await request('http://localhost:3000/graphql', query, variables).then(
                data => console.log('Created Product:', data),
                err => console.log(err),
            );
        }
    }

    private makeProductTranslation(
        languageCode: LanguageCode,
        name: string,
        slug: string,
        description: string,
    ): LocalizedInput<Product> {
        return {
            languageCode,
            name: `${languageCode} ${name}`,
            slug: `${languageCode} ${slug}`,
            description: `${languageCode} ${description}`,
        };
    }

    private makeProductVariant(variantName: string, languageCodes: LanguageCode[]): CreateProductVariantDto {
        return {
            price: faker.random.number({ min: 100, max: 5000 }),
            sku: faker.random.alphaNumeric(8).toUpperCase(),
            translations: languageCodes.map(code => ({
                languageCode: code,
                name: `${variantName} ${code}`,
            })),
        };
    }
}
