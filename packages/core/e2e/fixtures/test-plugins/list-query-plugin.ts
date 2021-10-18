import { OnApplicationBootstrap } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import {
    Ctx,
    ListQueryBuilder,
    LocaleString,
    PluginCommonModule,
    RequestContext,
    TransactionalConnection,
    Translatable,
    translateDeep,
    Translation,
    VendureEntity,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../../src/common/calculated-decorator';
import { EntityId } from '../../../src/entity/entity-id.decorator';

@Entity()
export class TestEntity extends VendureEntity implements Translatable {
    constructor(input: Partial<TestEntity>) {
        super(input);
    }
    @Column()
    label: string;

    name: LocaleString;

    @Column()
    description: string;

    @Column()
    active: boolean;

    @Column()
    order: number;

    @Column()
    date: Date;

    @Calculated({
        query: qb =>
            qb
                .leftJoin(
                    qb1 => {
                        return qb1
                            .from(TestEntity, 'entity')
                            .select('LENGTH(entity.description)', 'deslen')
                            .addSelect('entity.id', 'eid');
                    },
                    't1',
                    't1.eid = testentity.id',
                )
                .addSelect('t1.deslen', 'deslen'),
        expression: 'deslen',
    })
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

    @OneToMany(type => TestEntityTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<TestEntity>>;
}

@Entity()
export class TestEntityTranslation extends VendureEntity implements Translation<TestEntity> {
    constructor(input?: DeepPartial<Translation<TestEntity>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => TestEntity, base => base.translations)
    base: TestEntity;
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
    testEntities(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.listQueryBuilder
            .build(TestEntity, args.options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                for (const item of items) {
                    if (item.prices && item.prices.length) {
                        item.activePrice = item.prices[0].price;
                    }
                }
                return {
                    items: items.map(i => translateDeep(i, ctx.languageCode)),
                    totalItems,
                };
            });
    }
}

const apiExtensions = gql`
    type TestEntity implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        label: String!
        name: String!
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
    entities: [TestEntity, TestEntityPrice, TestEntityTranslation],
    adminApiExtensions: {
        schema: apiExtensions,
        resolvers: [ListQueryResolver],
    },
    shopApiExtensions: {
        schema: apiExtensions,
        resolvers: [ListQueryResolver],
    },
})
export class ListQueryPlugin implements OnApplicationBootstrap {
    constructor(private connection: TransactionalConnection) {}

    async onApplicationBootstrap() {
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
                new TestEntity({
                    label: 'F',
                    description: 'quis nostrud exercitation ullamco', // 33
                    date: new Date('2020-02-07T10:00:00.000Z'),
                    active: false,
                    order: 5,
                }),
            ]);

            const translations: any = {
                A: { [LanguageCode.en]: 'apple', [LanguageCode.de]: 'apfel' },
                B: { [LanguageCode.en]: 'bike', [LanguageCode.de]: 'fahrrad' },
                C: { [LanguageCode.en]: 'cake', [LanguageCode.de]: 'kuchen' },
                D: { [LanguageCode.en]: 'dog', [LanguageCode.de]: 'hund' },
                E: { [LanguageCode.en]: 'egg' },
                F: { [LanguageCode.de]: 'baum' },
            };

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

                for (const code of [LanguageCode.en, LanguageCode.de]) {
                    const translation = translations[testEntity.label][code];
                    if (translation) {
                        await this.connection.getRepository(TestEntityTranslation).save(
                            new TestEntityTranslation({
                                name: translation,
                                base: testEntity,
                                languageCode: code,
                            }),
                        );
                    }
                }
            }
        }
    }
}
