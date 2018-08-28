import * as faker from 'faker/locale/en_GB';
import { request } from 'graphql-request';
import {
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionGroupVariables,
} from 'shared/generated-types';
import { LanguageCode } from 'shared/generated-types';
import { ID } from 'shared/shared-types';

import { CREATE_PRODUCT_OPTION_GROUP } from '../../admin-ui/src/app/data/mutations/product-mutations';
import { PasswordService } from '../src/auth/password.service';
import { VendureConfig } from '../src/config/vendure-config';
import { CreateAddressDto } from '../src/entity/address/address.dto';
import { CreateAdministratorDto } from '../src/entity/administrator/administrator.dto';
import { CreateCustomerDto } from '../src/entity/customer/customer.dto';
import { Customer } from '../src/entity/customer/customer.entity';
import { CreateProductDto } from '../src/entity/product/product.dto';
import { Product } from '../src/entity/product/product.entity';
import { TranslationInput } from '../src/locale/locale-types';

import { SimpleGraphQLClient } from './gql-request';

// tslint:disable:no-console
/**
 * A service for creating mock data via the GraphQL API.
 */
export class MockDataClientService {
    apiUrl: string;
    client: SimpleGraphQLClient;

    constructor(config: VendureConfig) {
        this.client = new SimpleGraphQLClient(`http://localhost:${config.port}/${config.apiPath}`);
        // make the generated results deterministic
        faker.seed(1);
    }

    async populateOptions(): Promise<any> {
        await this.client
            .request<CreateProductOptionGroup, CreateProductOptionGroupVariables>(
                CREATE_PRODUCT_OPTION_GROUP,
                {
                    input: {
                        code: 'size',
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Size' },
                            { languageCode: LanguageCode.de, name: 'Größe' },
                        ],
                        options: [
                            {
                                code: 'small',
                                translations: [
                                    { languageCode: LanguageCode.en, name: 'Small' },
                                    { languageCode: LanguageCode.de, name: 'Klein' },
                                ],
                            },
                            {
                                code: 'large',
                                translations: [
                                    { languageCode: LanguageCode.en, name: 'Large' },
                                    { languageCode: LanguageCode.de, name: 'Groß' },
                                ],
                            },
                        ],
                    },
                },
            )
            .then(
                data => console.log('Created option group:', data.createProductOptionGroup.name),
                err => console.log(err),
            );
    }

    async populateAdmins(): Promise<any> {
        const query = `mutation($input: CreateAdministratorInput!) {
                            createAdministrator(input: $input) { id, emailAddress }
                        }`;

        const variables = {
            input: {
                firstName: 'Super',
                lastName: 'Admin',
                emailAddress: 'admin@test.com',
                password: 'test',
            } as CreateAdministratorDto,
        };

        await request(this.apiUrl, query, variables).then(
            data => console.log('Created Administrator:', data),
            err => console.log(err),
        );
    }

    async populateCustomers(count: number = 5): Promise<any> {
        const passwordService = new PasswordService();

        for (let i = 0; i < count; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            const query1 = `mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
                            createCustomer(input: $input, password: $password) { id, emailAddress }
                           }`;

            const variables1 = {
                input: {
                    firstName,
                    lastName,
                    emailAddress: faker.internet.email(firstName, lastName),
                    phoneNumber: faker.phone.phoneNumber(),
                } as CreateCustomerDto,
                password: 'test',
            };

            const customer: Customer | void = await request(this.apiUrl, query1, variables1).then(
                (data: any) => data.createCustomer as Customer,
                err => console.log(err),
            );

            if (customer) {
                const query2 = `mutation($customerId: ID!, $input: CreateAddressInput) {
                                createCustomerAddress(customerId: $customerId, input: $input) {
                                    id
                                    streetLine1
                                }
                            }`;

                const variables2 = {
                    input: {
                        fullName: `${firstName} ${lastName}`,
                        streetLine1: faker.address.streetAddress(),
                        city: faker.address.city(),
                        province: faker.address.county(),
                        postalCode: faker.address.zipCode(),
                        country: faker.address.country(),
                    } as CreateAddressDto,
                    customerId: customer.id,
                };

                await request(this.apiUrl, query2, variables2).then(
                    data => {
                        console.log(`Created Customer ${i + 1}:`, data);
                        return data as Customer;
                    },
                    err => console.log(err),
                );
            }
        }
    }

    async populateProducts(count: number = 5): Promise<any> {
        for (let i = 0; i < count; i++) {
            const query = `mutation CreateProduct($input: CreateProductInput) {
                            createProduct(input: $input) { id, name }
                           }`;

            const name = faker.commerce.productName();
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const description = faker.lorem.sentence();
            const languageCodes = [LanguageCode.en, LanguageCode.de];

            const variables = {
                input: {
                    image: faker.image.imageUrl(),
                    optionGroupCodes: ['size'],
                    translations: languageCodes.map(code =>
                        this.makeProductTranslation(code, name, slug, description),
                    ),
                } as CreateProductDto,
            };

            const product = await request<any>(this.apiUrl, query, variables).then(
                data => {
                    console.log(`Created Product ${i + 1}:`, data);
                    return data;
                },
                err => console.log(err),
            );
            const prodWithVariants = await this.makeProductVariant(product.createProduct.id);
            const variants = prodWithVariants.variants;
            for (const variant of variants) {
                const variantEN = variant.translations[0];
                const variantDE = { ...variantEN };
                variantDE.languageCode = LanguageCode.de;
                variantDE.name = variantDE.name.replace(LanguageCode.en, LanguageCode.de);
                variantDE.id = undefined;
                variant.translations.push(variantDE);
            }
            await request(
                this.apiUrl,
                `
                 mutation UpdateVariants($input: [UpdateProductVariantInput!]!) {
                     updateProductVariants(input: $input) {
                        id
                    }
                }`,
                {
                    input: variants,
                },
            );
        }
    }

    private makeProductTranslation(
        languageCode: LanguageCode,
        name: string,
        slug: string,
        description: string,
    ): TranslationInput<Product> {
        return {
            languageCode,
            name: `${languageCode} ${name}`,
            slug: `${languageCode} ${slug}`,
            description: `${languageCode} ${description}`,
        };
    }

    private async makeProductVariant(productId: ID): Promise<any> {
        const query = `mutation GenerateVariants($productId: ID!) {
            generateVariantsForProduct(productId: $productId) {
                id
                name
                variants {
                    id
                    translations {
                        id
                        languageCode
                        name
                    }
                    sku
                    image
                    price
                }
            }
         }`;
        return request<any>(this.apiUrl, query, { productId }).then(
            data => data.generateVariantsForProduct,
            err => console.log(err),
        );
    }
}
