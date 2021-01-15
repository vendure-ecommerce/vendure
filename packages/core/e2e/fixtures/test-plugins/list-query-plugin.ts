import { Args, Query, Resolver } from '@nestjs/graphql';
import { ID } from '@vendure/common/lib/shared-types';
import {
    ListQueryBuilder,
    OnVendureBootstrap,
    PluginCommonModule,
    TransactionalConnection,
    VendureEntity,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../../src/common/calculated-decorator';
import { EntityId } from '../../../src/entity/entity-id.decorator';

@Entity()
export class TestEntity extends VendureEntity {
    constructor(input: Partial<TestEntity>) {
        super(input);
    }
    @Column()
    label: string;

    @Column()
    description: string;

    @Column()
    active: boolean;

    @Column()
    order: number;

    @Column()
    date: Date;

    @Calculated({ expression: 'LENGTH(description)' })
    get descriptionLength() {
        return this.description.length || 0;
    }

    @Calculated({
        relations: ['prices'],
        expression: 'prices.price',
    })
    get price() {
        return this.activePrice;
    }

    // calculated at runtime
    activePrice: number;

    @OneToMany(type => TestEntityPrice, price => price.parent)
    prices: TestEntityPrice[];
}

@Entity()
export class TestEntityPrice extends VendureEntity {
    constructor(input: Partial<TestEntityPrice>) {
        super(input);
    }

    @EntityId() channelId: ID;

    @Column()
    price: number;

    @ManyToOne(type => TestEntity, parent => parent.prices)
    parent: TestEntity;
}

@Resolver()
export class ListQueryResolver {
    constructor(private listQueryBuilder: ListQueryBuilder) {}

    @Query()
    testEntities(@Args() args: any) {
        return this.listQueryBuilder
            .build(TestEntity, args.options)
            .getManyAndCount()
            .then(([items, totalItems]) => {
                for (const item of items) {
                    if (item.prices && item.prices.length) {
                        item.activePrice = item.prices[0].price;
                    }
                }
                return {
                    items,
                    totalItems,
                };
            });
    }
}

const adminApiExtensions = gql`
    type TestEntity implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        label: String!
        description: String!
        active: Boolean!
        order: Int!
        date: DateTime!
        descriptionLength: Int!
        price: Int!
    }

    type TestEntityList implements PaginatedList {
        totalItems: Int!
        items: [TestEntity!]!
    }

    extend type Query {
        testEntities(options: TestEntityListOptions): TestEntityList!
    }

    input TestEntityListOptions
`;

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [TestEntity, TestEntityPrice],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [ListQueryResolver],
    },
})
export class ListQueryPlugin implements OnVendureBootstrap {
    constructor(private connection: TransactionalConnection) {}

    async onVendureBootstrap() {
        const count = await this.connection.getRepository(TestEntity).count();
        if (count === 0) {
            const testEntities = await this.connection.getRepository(TestEntity).save([
                new TestEntity({
                    label: 'A',
                    description: 'Lorem ipsum', // 11
                    date: new Date('2020-01-05T10:00:00.000Z'),
                    active: true,
                    order: 0,
                }),
                new TestEntity({
                    label: 'B',
                    description: 'dolor sit', // 9
                    date: new Date('2020-01-15T10:00:00.000Z'),
                    active: true,
                    order: 1,
                }),
                new TestEntity({
                    label: 'C',
                    description: 'consectetur adipiscing', // 22
                    date: new Date('2020-01-25T10:00:00.000Z'),
                    active: false,
                    order: 2,
                }),
                new TestEntity({
                    label: 'D',
                    description: 'eiusmod tempor', // 14
                    date: new Date('2020-01-30T10:00:00.000Z'),
                    active: true,
                    order: 3,
                }),
                new TestEntity({
                    label: 'E',
                    description: 'incididunt ut', // 13
                    date: new Date('2020-02-05T10:00:00.000Z'),
                    active: false,
                    order: 4,
                }),
            ]);
            for (const testEntity of testEntities) {
                await this.connection.getRepository(TestEntityPrice).save([
                    new TestEntityPrice({
                        price: testEntity.description.length,
                        channelId: 1,
                        parent: testEntity,
                    }),
                    new TestEntityPrice({
                        price: testEntity.description.length * 100,
                        channelId: 2,
                        parent: testEntity,
                    }),
                ]);
            }
        }
    }
}
