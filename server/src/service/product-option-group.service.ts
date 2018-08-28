import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { LanguageCode } from 'shared/generated-types';
import { Connection, FindManyOptions, Like } from 'typeorm';

import { ID } from '../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { createTranslatable } from '../common/create-translatable';
import { updateTranslatable } from '../common/update-translatable';
import { assertFound } from '../common/utils';
import { ProductOptionGroupTranslation } from '../entity/product-option-group/product-option-group-translation.entity';
import {
    CreateProductOptionGroupDto,
    UpdateProductOptionGroupDto,
} from '../entity/product-option-group/product-option-group.dto';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { Translated } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';
import { TranslationUpdaterService } from '../locale/translation-updater.service';

@Injectable()
export class ProductOptionGroupService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
    ) {}

    findAll(lang: LanguageCode, filterTerm?: string): Promise<Array<Translated<ProductOptionGroup>>> {
        const findOptions: FindManyOptions = {
            relations: ['options'],
        };
        if (filterTerm) {
            findOptions.where = {
                code: Like(`%${filterTerm}%`),
            };
        }
        return this.connection.manager
            .find(ProductOptionGroup, findOptions)
            .then(groups => groups.map(group => translateDeep(group, lang, ['options'])));
    }

    findOne(id: ID, lang: LanguageCode): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection.manager
            .findOne(ProductOptionGroup, id, {
                relations: ['options'],
            })
            .then(group => group && translateDeep(group, lang, ['options']));
    }

    async create(
        createProductOptionGroupDto: CreateProductOptionGroupDto,
    ): Promise<Translated<ProductOptionGroup>> {
        const save = createTranslatable(ProductOptionGroup, ProductOptionGroupTranslation);
        const group = await save(this.connection, createProductOptionGroupDto);
        return assertFound(this.findOne(group.id, DEFAULT_LANGUAGE_CODE));
    }

    async update(
        updateProductOptionGroupDto: UpdateProductOptionGroupDto,
    ): Promise<Translated<ProductOptionGroup>> {
        const save = updateTranslatable(
            ProductOptionGroup,
            ProductOptionGroupTranslation,
            this.translationUpdaterService,
        );
        const group = await save(this.connection, updateProductOptionGroupDto);
        return assertFound(this.findOne(group.id, DEFAULT_LANGUAGE_CODE));
    }
}
