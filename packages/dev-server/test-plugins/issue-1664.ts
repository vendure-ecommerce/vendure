import {
    Facet,
    LanguageCode,
    LocaleString,
    PluginCommonModule,
    Product,
    Translation,
    VendureEntity,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
class Vendor extends VendureEntity {
    constructor(input: Partial<Vendor>) {
        super(input);
    }

    description: LocaleString;

    @Column()
    name: string;

    @OneToMany(() => Product, product => (product.customFields as any).vendor)
    products: Product[];

    @OneToMany(() => VendorTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Vendor>>;
}

@Entity()
export class VendorTranslation extends VendureEntity implements Translation<Vendor> {
    constructor(input?: Partial<Translation<Vendor>>) {
        super(input);
    }

    @Column('varchar')
    languageCode: LanguageCode;

    @Column('text')
    description: string;

    @ManyToOne(() => Vendor, vendor => vendor.translations, { onDelete: 'CASCADE' })
    base: Vendor;
}

const schema = gql`
    type Vendor implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        description: String!
    }
`;

/**
 * Test plugin for https://github.com/vendure-ecommerce/vendure/issues/1664
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [Vendor, VendorTranslation],
    shopApiExtensions: { schema, resolvers: [] },
    adminApiExtensions: { schema, resolvers: [] },
    configuration: config => {
        config.customFields.Product.push({
            name: 'vendor',
            label: [{ languageCode: LanguageCode.en_AU, value: 'Vendor' }],
            type: 'relation',
            entity: Vendor,
            eager: true,
            nullable: false,
            defaultValue: null,
            ui: {
                component: 'cp-product-vendor-selector',
            },
        });
        config.customFields.User.push({
            name: 'vendor',
            label: [{ languageCode: LanguageCode.en_AU, value: 'Vendor' }],
            type: 'relation',
            entity: Vendor,
            eager: true,
            nullable: false,
            defaultValue: null,
            ui: {
                component: 'cp-product-vendor-selector',
            },
        });
        config.customFields.User.push({
            name: 'facet',
            label: [{ languageCode: LanguageCode.en_AU, value: 'Facet' }],
            type: 'relation',
            entity: Facet,
            eager: true,
            nullable: false,
            defaultValue: null,
        });

        config.customFields.Product.push({
            name: 'shopifyId',
            type: 'float',
            public: false,
        });
        return config;
    },
})
export class Test1664Plugin {}
