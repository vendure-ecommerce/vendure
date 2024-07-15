import { Mutation, Resolver } from '@nestjs/graphql';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import {
    ActiveOrderService,
    Ctx,
    CustomFieldRelationService,
    isGraphQlErrorResult,
    LanguageCode,
    Order,
    OrderService,
    PluginCommonModule,
    RequestContext,
    Transaction,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';
import { VendureEntity, EntityId, ID, OrderLine } from '@vendure/core';
import gql from 'graphql-tag';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CutCode extends VendureEntity {
    constructor(input?: DeepPartial<CutCode>) {
        super(input);
    }

    @Column()
    code: string;
}

@Entity()
class Cut extends VendureEntity {
    constructor(input?: DeepPartial<Cut>) {
        super(input);
    }

    @ManyToOne(() => OrderLine, { onDelete: 'CASCADE', nullable: true })
    orderLine: OrderLine;

    @EntityId()
    orderLineId: ID;

    // ---> BUG: This eager definition won't work as soon as the customField 'cuts' on the OrderLine is set to be eagerly loaded
    @ManyToOne(() => CutCode, { eager: true })
    code: CutCode;

    @EntityId()
    codeId: ID;

    @Column()
    name: string;
}

const commonApiExtensions = gql`
    type CutCode implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        code: String!
    }
    type Cut implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        orderLine: OrderLine!
        name: String!
        code: CutCode!
    }
    extend type Mutation {
        addCutToOrder: Order
    }
`;

@Resolver('Order')
export class EagerRelationsBugOrderResolver {
    constructor(
        private connection: TransactionalConnection,
        private activeOrderService: ActiveOrderService,
        private orderService: OrderService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    @Transaction()
    @Mutation()
    async addCutToOrder(@Ctx() ctx: RequestContext): Promise<Order | null> {
        const sessionOrder = await this.activeOrderService.getActiveOrder(ctx, {}, true);

        const order = await this.orderService.findOne(ctx, sessionOrder.id);

        if (!order) {
            return null;
        }

        let orderLine = order.lines.length > 0 ? order.lines[0] : null;

        if (!orderLine) {
            const result = await this.orderService.addItemToOrder(ctx, sessionOrder.id, 1, 1);
            if (isGraphQlErrorResult(result)) {
                throw result.message;
            } else {
                orderLine = result.lines[result.lines.length - 1];
            }
        }

        let cut = await this.connection.getRepository(ctx, Cut).findOne({ where: { name: 'my-cut' } });
        if (!cut) {
            cut = new Cut({ name: 'my-cut' });
        }

        cut.orderLine = orderLine;

        let cutCode = await this.connection
            .getRepository(ctx, CutCode)
            .findOne({ where: { code: 'cut-code' } });

        if (!cutCode) {
            // Create dummy cutcode
            const newCutCode = new CutCode({ code: 'cut-code' });
            cutCode = await this.connection.getRepository(ctx, CutCode).save(newCutCode, { reload: true });
        }

        cut.code = cutCode;

        // Save cut
        cut = await this.connection.getRepository(ctx, Cut).save(cut, { reload: true });

        const customFields = {
            ...orderLine.customFields,
            cuts: [cut],
        };
        orderLine.customFields = customFields;
        // Save order line
        const savedOrderLine = await this.connection.getRepository(ctx, OrderLine).save(orderLine);
        await this.customFieldRelationService.updateRelations(
            ctx,
            OrderLine,
            { customFields },
            savedOrderLine,
        );

        return (await this.orderService.findOne(ctx, sessionOrder.id)) || null;
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [],
    entities: [Cut, CutCode],
    shopApiExtensions: {
        resolvers: [EagerRelationsBugOrderResolver],
        schema: commonApiExtensions,
    },
    adminApiExtensions: {
        resolvers: [EagerRelationsBugOrderResolver],
        schema: commonApiExtensions,
    },
    configuration: config => {
        config.customFields.OrderLine.push(
            {
                name: 'cuts',
                type: 'relation',
                entity: Cut,
                list: true,
                eager: true, // ---> BUG: As soon as this relation is set to be loaded eagerly the eager relation to 'code' in the Cut entity won't be resolved anymore.
                label: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Cuts',
                    },
                ],
            },
            {
                name: 'comment',
                type: 'string',
                label: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Comment',
                    },
                ],
            },
        );
        return config;
    },
    compatibility: '^2.1.0',
})
export class EagerRelationsBugPlugin {}
