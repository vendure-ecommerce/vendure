import { Connection, createConnection } from 'typeorm';
import * as faker from 'faker/locale/en_GB';
import { UserEntity } from '../core/entity/user/user.entity';
import { AddressEntity } from '../core/entity/address/address.entity';
import { ProductEntity } from '../core/entity/product/product.entity';
import { ProductTranslationEntity } from '../core/entity/product/product-translation.entity';
import { ProductVariantTranslationEntity } from '../core/entity/product-variant/product-variant-translation.entity';
import { ProductVariantEntity } from '../core/entity/product-variant/product-variant.entity';

populate();

export async function populate() {
    const connection = await createConnection({
        type: 'mysql',
        entities: ['./**/entity/**/*.entity.ts'],
        synchronize: true,
        logging: false,
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
        database: 'test',
    });

    await populateUsersAndAddresses(connection);
    await populateProducts(connection);
}

async function populateProducts(connection: Connection) {
    for (let i = 0; i < 5; i++) {
        const product = new ProductEntity();
        product.image = faker.image.imageUrl();

        const name = faker.commerce.productName();
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const description = faker.lorem.sentence();

        const translation1 = makeProductTranslation('en', name, slug, description);
        const translation2 = makeProductTranslation('de', name, slug, description);
        await connection.manager.save(translation1);
        await connection.manager.save(translation2);

        // 1 - 4 variants
        const variantCount = Math.floor(Math.random() * 4) + 1;
        let variants = [];
        for (let j = 0; j < variantCount; j++) {
            const variant = new ProductVariantEntity();
            const variantName = `${name} variant ${j + 1}`;
            variant.image = faker.image.imageUrl();
            variant.price = faker.commerce.price(100, 12000, 0);

            const variantTranslation1 = makeProductVariantTranslation('en', variantName);
            const variantTranslation2 = makeProductVariantTranslation('de', variantName);
            await connection.manager.save(variantTranslation1);
            await connection.manager.save(variantTranslation2);

            variant.translations = [variantTranslation1, variantTranslation2];
            await connection.manager.save(variant);
            console.log(`${j + 1}. created product variant ${variantName}`);
            variants.push(variant);
        }

        product.variants = variants;
        product.translations = [translation1, translation2];
        await connection.manager.save(product);
        console.log(`${i + 1}. created product & translations for ${translation1.name}`);
    }
}

function makeProductTranslation(
    langCode: string,
    name: string,
    slug: string,
    description: string,
): ProductTranslationEntity {
    const productTranslation = new ProductTranslationEntity();
    productTranslation.languageCode = langCode;
    productTranslation.name = `${langCode} ${name}`;
    productTranslation.slug = `${langCode} ${slug}`;
    productTranslation.description = `${langCode} ${description}`;
    return productTranslation;
}

function makeProductVariantTranslation(langCode: string, name: string): ProductVariantTranslationEntity {
    const productVariantTranslation = new ProductVariantTranslationEntity();
    productVariantTranslation.languageCode = langCode;
    productVariantTranslation.name = `${langCode} ${name}`;;
    return productVariantTranslation;
}

async function populateUsersAndAddresses(connection: Connection) {
    for (let i = 0; i < 5; i++) {
        const user = new UserEntity();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.emailAddress = faker.internet.email(user.firstName, user.lastName);
        user.phoneNumber = faker.phone.phoneNumber();

        const address = new AddressEntity();
        address.fullName = `${user.firstName} ${user.lastName}`;
        address.streetLine1 = faker.address.streetAddress();
        address.city = faker.address.city();
        address.province = faker.address.county();
        address.postalCode = faker.address.zipCode();
        address.country = faker.address.countryCode();

        await connection.manager.save(address);

        user.addresses = [address];
        await connection.manager.save(user);
        console.log('created user and address for ' + user.firstName + ' ' + user.lastName);
    }
}
