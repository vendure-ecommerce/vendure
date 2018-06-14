import * as faker from 'faker/locale/en_GB';
import { Connection, createConnection } from 'typeorm';
import { PasswordService } from '../core/auth/password.service';
import { Role } from '../core/auth/role';
import { Address } from '../core/entity/address/address.entity';
import { Administrator } from '../core/entity/administrator/administrator.entity';
import { Customer } from '../core/entity/customer/customer.entity';
import { ProductOptionGroupTranslation } from '../core/entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../core/entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../core/entity/product-option/product-option-translation.entity';
import { ProductOption } from '../core/entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../core/entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../core/entity/product-variant/product-variant.entity';
import { ProductTranslation } from '../core/entity/product/product-translation.entity';
import { Product } from '../core/entity/product/product.entity';
import { User } from '../core/entity/user/user.entity';
import { LanguageCode } from '../core/locale/language-code';

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

    async populateOptions(): Promise<ProductOptionGroup> {
        const sizeGroup = new ProductOptionGroup();
        sizeGroup.code = 'size';

        const sizeGroupEN = new ProductOptionGroupTranslation();
        sizeGroupEN.languageCode = LanguageCode.EN;
        sizeGroupEN.name = 'Size';
        await this.connection.manager.save(sizeGroupEN);
        const sizeGroupDE = new ProductOptionGroupTranslation();

        sizeGroupDE.languageCode = LanguageCode.DE;
        sizeGroupDE.name = 'Größe';
        await this.connection.manager.save(sizeGroupDE);

        sizeGroup.translations = [sizeGroupEN, sizeGroupDE];
        await this.connection.manager.save(sizeGroup);

        await this.populateSizeOptions(sizeGroup);

        console.log('created size options');
        return sizeGroup;
    }

    private async populateSizeOptions(sizeGroup: ProductOptionGroup) {
        const sizeSmall = new ProductOption();
        sizeSmall.code = 'small';

        const sizeSmallEN = new ProductOptionTranslation();
        sizeSmallEN.languageCode = LanguageCode.EN;
        sizeSmallEN.name = 'Small';
        await this.connection.manager.save(sizeSmallEN);

        const sizeSmallDE = new ProductOptionTranslation();
        sizeSmallDE.languageCode = LanguageCode.DE;
        sizeSmallDE.name = 'Klein';
        await this.connection.manager.save(sizeSmallDE);

        sizeSmall.translations = [sizeSmallEN, sizeSmallDE];
        sizeSmall.group = sizeGroup;
        await this.connection.manager.save(sizeSmall);

        const sizeLarge = new ProductOption();
        sizeLarge.code = 'large';

        const sizeLargeEN = new ProductOptionTranslation();
        sizeLargeEN.languageCode = LanguageCode.EN;
        sizeLargeEN.name = 'Large';
        await this.connection.manager.save(sizeLargeEN);

        const sizeLargeDE = new ProductOptionTranslation();
        sizeLargeDE.languageCode = LanguageCode.DE;
        sizeLargeDE.name = 'Groß';
        await this.connection.manager.save(sizeLargeDE);

        sizeLarge.translations = [sizeLargeEN, sizeLargeDE];
        sizeLarge.group = sizeGroup;
        await this.connection.manager.save(sizeLarge);

        sizeGroup.options = [sizeSmall, sizeLarge];
    }

    async populateProducts(optionGroup: ProductOptionGroup) {
        for (let i = 0; i < 5; i++) {
            const addOption = i === 2 || i === 4;

            const product = new Product();
            product.image = faker.image.imageUrl();

            const name = faker.commerce.productName();
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const description = faker.lorem.sentence();

            const translation1 = this.makeProductTranslation(LanguageCode.EN, name, slug, description);
            const translation2 = this.makeProductTranslation(LanguageCode.DE, name, slug, description);
            await this.connection.manager.save(translation1);
            await this.connection.manager.save(translation2);

            // 1 - 4 variants
            const variantCount = Math.floor(Math.random() * 4) + 1;
            const variants: ProductVariant[] = [];
            for (let j = 0; j < variantCount; j++) {
                const variant = new ProductVariant();
                const variantName = `${name} variant ${j + 1}`;
                variant.image = faker.image.imageUrl();
                variant.price = faker.random.number({ min: 100, max: 12000 });

                const variantTranslation1 = this.makeProductVariantTranslation(LanguageCode.EN, variantName);
                const variantTranslation2 = this.makeProductVariantTranslation(LanguageCode.DE, variantName);
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
            const customer = new Customer();
            customer.firstName = faker.name.firstName();
            customer.lastName = faker.name.lastName();
            customer.emailAddress = faker.internet.email(customer.firstName, customer.lastName);
            customer.phoneNumber = faker.phone.phoneNumber();

            const user = new User();
            user.passwordHash = await passwordService.hash('test');
            user.identifier = customer.emailAddress;
            user.roles = [Role.Customer];

            await this.connection.manager.save(user);

            const address = new Address();
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

        const user = new User();
        user.passwordHash = await passwordService.hash('admin');
        user.identifier = 'admin';
        user.roles = [Role.Superadmin];

        await this.connection.manager.save(user);

        const administrator = new Administrator();
        administrator.emailAddress = 'admin@test.com';
        administrator.firstName = 'Super';
        administrator.lastName = 'Admin';
        administrator.user = user;

        await this.connection.manager.save(administrator);
    }

    private makeProductTranslation(
        langCode: LanguageCode,
        name: string,
        slug: string,
        description: string,
    ): ProductTranslation {
        const productTranslation = new ProductTranslation();
        productTranslation.languageCode = langCode;
        productTranslation.name = `${langCode} ${name}`;
        productTranslation.slug = `${langCode} ${slug}`;
        productTranslation.description = `${langCode} ${description}`;
        return productTranslation;
    }

    private makeProductVariantTranslation(langCode: LanguageCode, name: string): ProductVariantTranslation {
        const productVariantTranslation = new ProductVariantTranslation();
        productVariantTranslation.languageCode = langCode;
        productVariantTranslation.name = `${langCode} ${name}`;
        return productVariantTranslation;
    }
}
