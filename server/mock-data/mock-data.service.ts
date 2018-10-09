import * as faker from 'faker/locale/en_GB';
import * as fs from 'fs-extra';
import gql from 'graphql-tag';
import * as path from 'path';
import {
    AddOptionGroupToProduct,
    AdjustmentSource,
    AdjustmentType,
    Asset,
    CreateAddressInput,
    CreateAdjustmentSource,
    CreateCustomerInput,
    CreateFacet,
    CreateFacetValueWithFacetInput,
    CreateProduct,
    CreateProductOptionGroup,
    GenerateProductVariants,
    LanguageCode,
    ProductTranslationInput,
    ProductVariant,
    UpdateProductVariants,
} from 'shared/generated-types';

import { CREATE_ADJUSTMENT_SOURCE } from '../../admin-ui/src/app/data/definitions/adjustment-source-definitions';
import { CREATE_FACET } from '../../admin-ui/src/app/data/definitions/facet-definitions';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    GENERATE_PRODUCT_VARIANTS,
    UPDATE_PRODUCT_VARIANTS,
} from '../../admin-ui/src/app/data/definitions/product-definitions';
import { taxAction } from '../src/config/adjustment/required-adjustment-actions';
import { taxCondition } from '../src/config/adjustment/required-adjustment-conditions';
import { Channel } from '../src/entity/channel/channel.entity';
import { Customer } from '../src/entity/customer/customer.entity';

import { SimpleGraphQLClient } from './simple-graphql-client';

// tslint:disable:no-console
/**
 * A service for creating mock data via the GraphQL API.
 */
export class MockDataService {
    apiUrl: string;

    constructor(private client: SimpleGraphQLClient, private logging = true) {
        // make the generated results deterministic
        faker.seed(1);
    }

    async populateChannels(channelCodes: string[]): Promise<Channel[]> {
        const channels: Channel[] = [];
        for (const code of channelCodes) {
            const channel = await this.client.query<any>(gql`
                mutation {
                    createChannel(code: "${code}") {
                        id
                        code
                        token
                    }
                }
            `);
            channels.push(channel.createChannel);
            this.log(`Created Channel: ${channel.createChannel.code}`);
        }
        return channels;
    }

    async populateOptions(): Promise<string> {
        return this.client
            .query<CreateProductOptionGroup.Mutation, CreateProductOptionGroup.Variables>(
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
            .then(data => {
                this.log('Created option group:', data.createProductOptionGroup.name);
                return data.createProductOptionGroup.id;
            });
    }

    async populateTaxCategories() {
        const taxCategories = [
            { name: 'Standard Tax', rate: 20 },
            { name: 'Reduced Tax', rate: 5 },
            { name: 'Zero Tax', rate: 0 },
        ];

        const results: AdjustmentSource.Fragment[] = [];

        for (const category of taxCategories) {
            const result = await this.client.query<
                CreateAdjustmentSource.Mutation,
                CreateAdjustmentSource.Variables
            >(CREATE_ADJUSTMENT_SOURCE, {
                input: {
                    name: category.name,
                    type: AdjustmentType.TAX,
                    enabled: true,
                    conditions: [
                        {
                            code: taxCondition.code,
                            arguments: [],
                        },
                    ],
                    actions: [
                        {
                            code: taxAction.code,
                            arguments: [category.rate.toString()],
                        },
                    ],
                },
            });
            results.push(result.createAdjustmentSource);
        }
        this.log(`Created ${results.length} tax categories`);
        return results;
    }

    async populateCustomers(count: number = 5): Promise<any> {
        for (let i = 0; i < count; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            const query1 = gql`
                mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
                    createCustomer(input: $input, password: $password) {
                        id
                        emailAddress
                    }
                }
            `;

            const variables1 = {
                input: {
                    firstName,
                    lastName,
                    emailAddress: faker.internet.email(firstName, lastName),
                    phoneNumber: faker.phone.phoneNumber(),
                } as CreateCustomerInput,
                password: 'test',
            };

            const customer: Customer | void = await this.client
                .query(query1, variables1)
                .then((data: any) => data.createCustomer as Customer, err => this.log(err));

            if (customer) {
                const query2 = gql`
                    mutation($customerId: ID!, $input: CreateAddressInput!) {
                        createCustomerAddress(customerId: $customerId, input: $input) {
                            id
                            streetLine1
                        }
                    }
                `;

                const variables2 = {
                    input: {
                        fullName: `${firstName} ${lastName}`,
                        streetLine1: faker.address.streetAddress(),
                        city: faker.address.city(),
                        province: faker.address.county(),
                        postalCode: faker.address.zipCode(),
                        country: faker.address.country(),
                    } as CreateAddressInput,
                    customerId: customer.id,
                };

                await this.client.query(query2, variables2).then(
                    data => {
                        this.log(`Created Customer ${i + 1}:`, data);
                        return data as Customer;
                    },
                    err => this.log(err),
                );
            }
        }
    }

    async populateAssets(): Promise<Asset[]> {
        const fileNames = await fs.readdir(path.join(__dirname, 'assets'));
        const filePaths = fileNames.map(fileName => path.join(__dirname, 'assets', fileName));
        return this.client.uploadAssets(filePaths).then(response => {
            console.log(`Created ${response.createAssets.length} Assets`);
            return response.createAssets;
        });
    }

    async populateProducts(
        count: number = 5,
        optionGroupId: string,
        assets: Asset[],
        taxCategories: AdjustmentSource.Fragment[],
    ): Promise<any> {
        for (let i = 0; i < count; i++) {
            const query = CREATE_PRODUCT;

            const name = faker.commerce.productName();
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const description = faker.lorem.sentence();
            const languageCodes = [LanguageCode.en, LanguageCode.de];

            // get 2 (pseudo) random asset ids
            const randomAssets = this.shuffleArray(assets).slice(0, 2);

            const variables: CreateProduct.Variables = {
                input: {
                    translations: languageCodes.map(code =>
                        this.makeProductTranslation(code, name, slug, description),
                    ),
                    assetIds: randomAssets.map(a => a.id),
                    featuredAssetId: randomAssets[0].id,
                },
            };

            const product = await this.client
                .query<CreateProduct.Mutation, CreateProduct.Variables>(query, variables)
                .then(
                    data => {
                        this.log(`Created Product ${i + 1}:`, data.createProduct.name);
                        return data;
                    },
                    err => this.log(err),
                );

            if (product) {
                await this.client.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
                    ADD_OPTION_GROUP_TO_PRODUCT,
                    {
                        productId: product.createProduct.id,
                        optionGroupId,
                    },
                );
                const prodWithVariants = await this.makeProductVariant(
                    product.createProduct.id,
                    taxCategories[0],
                );
                const variants = prodWithVariants.generateVariantsForProduct.variants;
                for (const variant of variants) {
                    const variantEN = variant.translations[0];
                    const variantDE = { ...variantEN };
                    variantDE.languageCode = LanguageCode.de;
                    variantDE.name = variantDE.name.replace(LanguageCode.en, LanguageCode.de);
                    delete variantDE.id;
                    variant.translations.push(variantDE);
                }
                await this.client.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: variants.map(({ id, translations, sku, price }) => ({
                            id,
                            translations,
                            sku,
                            price,
                        })),
                    },
                );
            }
        }
    }

    async populateFacets() {
        await this.client.query<CreateFacet.Mutation, CreateFacet.Variables>(CREATE_FACET, {
            input: {
                code: 'brand',
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Brand',
                    },
                    {
                        languageCode: LanguageCode.en,
                        name: 'Marke',
                    },
                ],
                values: this.makeFacetValues(10),
            },
        });
        this.log('Created "brand" Facet');
    }

    private makeFacetValues(count: number): CreateFacetValueWithFacetInput[] {
        return Array.from({ length: count }).map(() => {
            const brand = faker.company.companyName();
            return {
                code: brand.replace(/\s/g, '_'),
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: brand,
                    },
                    {
                        languageCode: LanguageCode.de,
                        name: brand,
                    },
                ],
            };
        });
    }

    private makeProductTranslation(
        languageCode: LanguageCode,
        name: string,
        slug: string,
        description: string,
    ): ProductTranslationInput {
        return {
            languageCode,
            name: `${languageCode} ${name}`,
            slug: `${languageCode} ${slug}`,
            description: `${languageCode} ${description}`,
        };
    }

    private async makeProductVariant(
        productId: string,
        taxCategory: AdjustmentSource.Fragment,
    ): Promise<GenerateProductVariants.Mutation> {
        const query = GENERATE_PRODUCT_VARIANTS;
        return this.client.query<GenerateProductVariants.Mutation, GenerateProductVariants.Variables>(query, {
            productId,
            defaultTaxCategoryId: taxCategory.id,
            defaultSku: faker.random.alphaNumeric(5),
            defaultPrice: faker.random.number({
                min: 100,
                max: 1000,
            }),
        });
    }

    private log(...args: any[]) {
        if (this.logging) {
            console.log(...args);
        }
    }

    /**
     * Deterministacally randomize array element order. Returns a new
     * shuffled array and leaves the input array intact.
     * Using Durstenfeld shuffle algorithm.
     *
     * Source: https://stackoverflow.com/a/12646864/772859
     */
    private shuffleArray<T>(array: T[]): T[] {
        const clone = array.slice(0);
        for (let i = clone.length - 1; i > 0; i--) {
            const j = Math.floor((faker.random.number(1000) / 1000) * (i + 1));
            const temp = clone[i];
            clone[i] = clone[j];
            clone[j] = temp;
        }
        return clone;
    }
}
