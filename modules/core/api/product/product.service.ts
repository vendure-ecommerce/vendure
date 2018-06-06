import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createQueryBuilder } from 'typeorm';
import { ProductVariantEntity } from '../../entity/product-variant/product-variant.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.interface';
import { ProductEntity } from '../../entity/product/product.entity';
import { Product } from '../../entity/product/product.interface';
import { Translatable, Translation } from '../../locale/locale-types';
import { LocaleService } from '../../locale/locale.service';
import { ProductRepository } from '../../repository/product-repository';

@Injectable()
export class ProductService {
    constructor(@InjectConnection() private connection: Connection, private localeService: LocaleService) {}

    findAll(lang?: string): Promise<Product[]> {
        return this.connection.getCustomRepository(ProductRepository).localeFind(lang);
    }

    findOne(productId: number, lang?: string): Promise<Product> {
        return this.connection.getCustomRepository(ProductRepository).localeFindOne(productId, lang);
    }
}
