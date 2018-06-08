import * as faker from 'faker/locale/en_GB';
import { Connection, createConnection } from 'typeorm';
import { PasswordService } from '../core/auth/password.service';
import { Role } from '../core/auth/role';
import { AddressEntity } from '../core/entity/address/address.entity';
import { AdministratorEntity } from '../core/entity/administrator/administrator.entity';
import { CustomerEntity } from '../core/entity/customer/customer.entity';
import { ProductOptionGroupTranslationEntity } from '../core/entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroupEntity } from '../core/entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslationEntity } from '../core/entity/product-option/product-option-translation.entity';
import { ProductOptionEntity } from '../core/entity/product-option/product-option.entity';
import { ProductVariantTranslationEntity } from '../core/entity/product-variant/product-variant-translation.entity';
import { ProductVariantEntity } from '../core/entity/product-variant/product-variant.entity';
import { ProductTranslationEntity } from '../core/entity/product/product-translation.entity';
import { ProductEntity } from '../core/entity/product/product.entity';
import { UserEntity } from '../core/entity/user/user.entity';

// tslint:disable:no-console
/**
 * A Class used for generating mock data directly into the database via TypeORM.
 */
export class MockDataService {
    connection: Connection;

    async populate(): Promise<any> {
        this.connection = await this.connect();
        await this.clearAllTables();
        await this.populateCustomersAndAddresses();
        await this.populateAdministrators();

        const sizeOptionGroup = await this.populateOptions();
        await this.populateProducts(sizeOptionGroup);
    }

    async connect(): Promise<Connection> {
        this.connection = await createConnection({
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

        return this.connection;
    }

    async clearAllTables() {
        await this.connection.synchronize(true);
        console.log('Cleared all tables');
    }

    async populateOptions(): Promise<ProductOptionGroupEntity> {
        const sizeGroup = new ProductOptionGroupEntity();
        sizeGroup.code = 'size';

        const sizeGroupEN = new ProductOptionGroupTranslationEntity();
        sizeGroupEN.languageCode = 'en';
        sizeGroupEN.name = 'Size';
        await this.connection.manager.save(sizeGroupEN);
        const sizeGroupDE = new ProductOptionGroupTranslationEntity();

        sizeGroupDE.languageCode = 'de';
        sizeGroupDE.name = 'Größe';
        await this.connection.manager.save(sizeGroupDE);

        sizeGroup.translations = [sizeGroupEN, sizeGroupDE];
        await this.connection.manager.save(sizeGroup);

        await this.populateSizeOptions(sizeGroup);

        console.log('created size options');
        return sizeGroup;
    }

    private async populateSizeOptions(sizeGroup: ProductOptionGroupEntity) {
        const sizeSmall = new ProductOptionEntity();
        sizeSmall.code = 'small';

        const sizeSmallEN = new ProductOptionTranslationEntity();
        sizeSmallEN.languageCode = 'en';
        sizeSmallEN.name = 'Small';
        await this.connection.manager.save(sizeSmallEN);

        const sizeSmallDE = new ProductOptionTranslationEntity();
        sizeSmallDE.languageCode = 'de';
        sizeSmallDE.name = 'Klein';
        await this.connection.manager.save(sizeSmallDE);

        sizeSmall.translations = [sizeSmallEN, sizeSmallDE];
        sizeSmall.group = sizeGroup;
        await this.connection.manager.save(sizeSmall);

        const sizeLarge = new ProductOptionEntity();
        sizeLarge.code = 'large';

        const sizeLargeEN = new ProductOptionTranslationEntity();
        sizeLargeEN.languageCode = 'en';
        sizeLargeEN.name = 'Large';
        await this.connection.manager.save(sizeLargeEN);

        const sizeLargeDE = new ProductOptionTranslationEntity();
        sizeLargeDE.languageCode = 'de';
        sizeLargeDE.name = 'Groß';
        await this.connection.manager.save(sizeLargeDE);

        sizeLarge.translations = [sizeLargeEN, sizeLargeDE];
        sizeLarge.group = sizeGroup;
        await this.connection.manager.save(sizeLarge);

        sizeGroup.options = [sizeSmall, sizeLarge];
    }

    async populateProducts(optionGroup: ProductOptionGroupEntity) {
        for (let i = 0; i < 5; i++) {
            const addOption = i === 2 || i === 4;

            const product = new ProductEntity();
            product.image = faker.image.imageUrl();

            const name = faker.commerce.productName();
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const description = faker.lorem.sentence();

            const translation1 = this.makeProductTranslation('en', name, slug, description);
            const translation2 = this.makeProductTranslation('de', name, slug, description);
            await this.connection.manager.save(translation1);
            await this.connection.manager.save(translation2);

            // 1 - 4 variants
            const variantCount = Math.floor(Math.random() * 4) + 1;
            const variants: ProductVariantEntity[] = [];
            for (let j = 0; j < variantCount; j++) {
                const variant = new ProductVariantEntity();
                const variantName = `${name} variant ${j + 1}`;
                variant.image = faker.image.imageUrl();
                variant.price = faker.random.number({ min: 100, max: 12000 });

                const variantTranslation1 = this.makeProductVariantTranslation('en', variantName);
                const variantTranslation2 = this.makeProductVariantTranslation('de', variantName);
                await this.connection.manager.save(variantTranslation1);
                await this.connection.manager.save(variantTranslation2);

                if (addOption) {
                    variant.options = [optionGroup.options[0]];
                } else {
                    variant.options = [];
                }
                variant.translations = [variantTranslation1, variantTranslation2];
                await this.connection.manager.save(variant);
                console.log(`${j + 1}. created product variant ${variantName}`);
                variants.push(variant);
            }

            if (addOption) {
                product.optionGroups = [optionGroup];
            }
            product.variants = variants;
            product.translations = [translation1, translation2];
            await this.connection.manager.save(product);
            console.log(`${i + 1}. created product & translations for ${translation1.name}`);
        }
    }

    async populateCustomersAndAddresses() {
        const passwordService = new PasswordService();

        for (let i = 0; i < 5; i++) {
            const customer = new CustomerEntity();
            customer.firstName = faker.name.firstName();
            customer.lastName = faker.name.lastName();
            customer.emailAddress = faker.internet.email(customer.firstName, customer.lastName);
            customer.phoneNumber = faker.phone.phoneNumber();

            const user = new UserEntity();
            user.passwordHash = await passwordService.hash('test');
            user.identifier = customer.emailAddress;
            user.roles = [Role.Customer];

            await this.connection.manager.save(user);

            const address = new AddressEntity();
            address.fullName = `${customer.firstName} ${customer.lastName}`;
            address.streetLine1 = faker.address.streetAddress();
            address.city = faker.address.city();
            address.province = faker.address.county();
            address.postalCode = faker.address.zipCode();
            address.country = faker.address.countryCode();

            await this.connection.manager.save(address);

            customer.addresses = [address];
            customer.user = user;
            await this.connection.manager.save(customer);
            console.log('created customer, user and address for ' + customer.firstName + ' ' + customer.lastName);
        }
    }

    async populateAdministrators() {
        const passwordService = new PasswordService();

        const user = new UserEntity();
        user.passwordHash = await passwordService.hash('admin');
        user.identifier = 'admin';
        user.roles = [Role.Superadmin];

        await this.connection.manager.save(user);

        const administrator = new AdministratorEntity();
        administrator.emailAddress = 'admin@test.com';
        administrator.firstName = 'Super';
        administrator.lastName = 'Admin';
        administrator.user = user;

        await this.connection.manager.save(administrator);
    }

    private makeProductTranslation(
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

    private makeProductVariantTranslation(langCode: string, name: string): ProductVariantTranslationEntity {
        const productVariantTranslation = new ProductVariantTranslationEntity();
        productVariantTranslation.languageCode = langCode;
        productVariantTranslation.name = `${langCode} ${name}`;
        return productVariantTranslation;
    }
}
