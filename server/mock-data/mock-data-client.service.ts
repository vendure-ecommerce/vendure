import * as faker from 'faker/locale/en_GB';
import { request } from 'graphql-request';

import { ID } from '../../shared/shared-types';
import { PasswordService } from '../src/auth/password.service';
import { VendureConfig } from '../src/config/vendure-config';
import { CreateAddressDto } from '../src/entity/address/address.dto';
import { CreateAdministratorDto } from '../src/entity/administrator/administrator.dto';
import { CreateCustomerDto } from '../src/entity/customer/customer.dto';
import { Customer } from '../src/entity/customer/customer.entity';
import { CreateProductOptionGroupDto } from '../src/entity/product-option-group/product-option-group.dto';
import { CreateProductVariantDto } from '../src/entity/product-variant/create-product-variant.dto';
import { CreateProductDto } from '../src/entity/product/product.dto';
import { Product } from '../src/entity/product/product.entity';
import { LanguageCode } from '../src/locale/language-code';
import { TranslationInput } from '../src/locale/locale-types';

// tslint:disable:no-console
/**
 * A service for creating mock data via the GraphQL API.
 */
export class MockDataClientService {
    apiUrl: string;

    constructor(config: VendureConfig) {
        this.apiUrl = `http://localhost:${config.port}/${config.apiPath}`;
    }

    async populateOptions(): Promise<any> {
        const query = `mutation($input: CreateProductOptionGroupInput) {
                            createProductOptionGroup(input: $input) { id }
                       }`;

        const variables = {
            input: {
                code: 'size',
                translations: [{ languageCode: 'en', name: 'Size' }, { languageCode: 'de', name: 'Größe' }],
                options: [
                    {
                        code: 'small',
                        translations: [
                            { languageCode: 'en', name: 'Small' },
                            { languageCode: 'de', name: 'Klein' },
                        ],
                    },
                    {
                        code: 'large',
                        translations: [
                            { languageCode: 'en', name: 'Large' },
                            { languageCode: 'de', name: 'Groß' },
                        ],
                    },
                ],
            } as CreateProductOptionGroupDto,
        };

        await request(this.apiUrl, query, variables).then(
            data => console.log('Created Administrator:', data),
            err => console.log(err),
        );

        console.log('created size options');
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
            const languageCodes = [LanguageCode.EN, LanguageCode.DE, LanguageCode.ES];

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
            await this.makeProductVariant(product.createProduct.id);
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
            }
         }`;
        await request(this.apiUrl, query, { productId }).then(data => data, err => console.log(err));
    }
}
