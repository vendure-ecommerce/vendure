import { Injectable } from '@nestjs/common';
import {
    CreateSellerInput,
    DeletionResponse,
    DeletionResult,
    UpdateSellerInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Seller } from '../../entity/seller/seller.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';

/**
 * @description
 * Contains methods relating to {@link Seller} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class SellerService {
    constructor(private connection: TransactionalConnection, private listQueryBuilder: ListQueryBuilder) {}

    async initSellers() {
        await this.ensureDefaultSellerExists();
    }

    findAll(ctx: RequestContext, options?: ListQueryOptions<Seller>): Promise<PaginatedList<Seller>> {
        return this.listQueryBuilder
            .build(Seller, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, sellerId: ID): Promise<Seller | undefined> {
        return this.connection.getRepository(ctx, Seller).findOne(sellerId);
    }

    create(ctx: RequestContext, input: CreateSellerInput) {
        return this.connection.getRepository(ctx, Seller).save(new Seller(input));
    }

    async update(ctx: RequestContext, input: UpdateSellerInput) {
        const seller = await this.connection.getEntityOrThrow(ctx, Seller, input.id);
        if (input.name) {
            seller.name = input.name;
            await this.connection.getRepository(ctx, Seller).save(seller);
        }
        return seller;
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const seller = await this.connection.getEntityOrThrow(ctx, Seller, id);
        await this.connection.getRepository(ctx, Seller).remove(seller);
        return {
            result: DeletionResult.DELETED,
        };
    }

    private async ensureDefaultSellerExists() {
        const sellers = await this.connection.rawConnection.getRepository(Seller).find();
        if (sellers.length === 0) {
            await this.connection.rawConnection.getRepository(Seller).save(
                new Seller({
                    name: 'Default Seller',
                }),
            );
        }
    }
}
