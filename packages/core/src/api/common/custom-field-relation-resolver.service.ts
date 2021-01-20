import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { Translatable } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { RelationCustomFieldConfig } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../../entity/base/base.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { translateDeep } from '../../service/helpers/utils/translate-entity';
import { ProductVariantService } from '../../service/services/product-variant.service';
import { TransactionalConnection } from '../../service/transaction/transactional-connection';

import { RequestContext } from './request-context';

export interface ResolveRelationConfig {
    ctx: RequestContext;
    entityId: ID;
    entityName: string;
    fieldDef: RelationCustomFieldConfig;
}

@Injectable()
export class CustomFieldRelationResolverService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private productVariantService: ProductVariantService,
    ) {}
    /**
     * @description
     * Used to dynamically resolve related entities in custom fields. Based on the field
     * config, this method is able to query the correct entity or entities from the database
     * to be returned through the GraphQL API.
     */
    async resolveRelation(config: ResolveRelationConfig): Promise<VendureEntity | VendureEntity[]> {
        const { ctx, entityId, entityName, fieldDef } = config;

        const subQb = this.connection
            .getRepository(ctx, entityName)
            .createQueryBuilder('entity')
            .leftJoin(`entity.customFields.${fieldDef.name}`, 'relationEntity')
            .select('relationEntity.id')
            .where('entity.id = :id');

        const qb = this.connection
            .getRepository(ctx, fieldDef.entity)
            .createQueryBuilder('relation')
            .where(`relation.id IN (${subQb.getQuery()})`)
            .setParameters({ id: entityId });
        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        const result = fieldDef.list ? await qb.getMany() : await qb.getOne();

        if (fieldDef.entity === ProductVariant) {
            if (Array.isArray(result)) {
                await Promise.all(result.map(r => this.applyVariantPrices(ctx, r as any)));
            } else {
                await this.applyVariantPrices(ctx, result as any);
            }
        }

        const translated: any = Array.isArray(result)
            ? result.map(r => (this.isTranslatable(r) ? translateDeep(r, ctx.languageCode) : r))
            : this.isTranslatable(result)
            ? translateDeep(result, ctx.languageCode)
            : result;

        return translated;
    }

    private isTranslatable(input: unknown): input is Translatable {
        return typeof input === 'object' && input != null && input.hasOwnProperty('translations');
    }

    private async applyVariantPrices(ctx: RequestContext, variant: ProductVariant): Promise<ProductVariant> {
        const taxCategory = await this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder()
            .relation('taxCategory')
            .of(variant)
            .loadOne();
        variant.taxCategory = taxCategory;
        // We use the ModuleRef to resolve the ProductVariantService here to
        // avoid a circular dependency in the Nest DI.
        return this.productVariantService.applyChannelPriceAndTax(variant, ctx);
    }
}
