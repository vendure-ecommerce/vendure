import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { ProductOptionGroupTranslation } from '../entity/product-option-group/product-option-group-translation.entity';
import {
    CreateProductOptionGroupDto,
    UpdateProductOptionGroupDto,
} from '../entity/product-option-group/product-option-group.dto';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { LanguageCode } from '../locale/language-code';
import { translateDeep } from '../locale/translate-entity';
import { TranslationUpdaterService } from '../locale/translation-updater.service';

@Injectable()
export class ProductOptionGroupService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
    ) {}

    findAll(lang: LanguageCode): Promise<ProductOptionGroup[]> {
        return this.connection.manager
            .find(ProductOptionGroup, {
                relations: ['options'],
            })
            .then(groups => groups.map(group => translateDeep(group, lang, ['options'])));
    }

    findOne(id: string, lang: LanguageCode): Promise<ProductOptionGroup | undefined> {
        return this.connection.manager
            .findOne(ProductOptionGroup, id, {
                relations: ['options'],
            })
            .then(group => group && translateDeep(group, lang, ['options']));
    }

    async create(createProductOptionGroupDto: CreateProductOptionGroupDto): Promise<ProductOptionGroup> {
        const optionGroup = new ProductOptionGroup(createProductOptionGroupDto);
        const translations: ProductOptionGroupTranslation[] = [];

        for (const input of createProductOptionGroupDto.translations) {
            const translation = new ProductOptionGroupTranslation(input);
            translations.push(translation);
            await this.connection.manager.save(translation);
        }

        optionGroup.translations = translations;
        const createdGroup = await this.connection.manager.save(optionGroup);

        return this.findOne(createdGroup.id, DEFAULT_LANGUAGE_CODE) as Promise<ProductOptionGroup>;
    }

    async update(updateProductOptionGroupDto: UpdateProductOptionGroupDto): Promise<ProductOptionGroup> {
        const existingTranslations = await this.connection.getRepository(ProductOptionGroupTranslation).find({
            where: { base: updateProductOptionGroupDto.id },
            relations: ['base'],
        });

        const translationUpdater = this.translationUpdaterService.create(ProductOptionGroupTranslation);
        const diff = translationUpdater.diff(existingTranslations, updateProductOptionGroupDto.translations);

        const productOptionGroup = await translationUpdater.applyDiff(
            new ProductOptionGroup(updateProductOptionGroupDto),
            diff,
        );
        await this.connection.manager.save(productOptionGroup);

        return this.findOne(productOptionGroup.id, DEFAULT_LANGUAGE_CODE) as Promise<ProductOptionGroup>;
    }
}
