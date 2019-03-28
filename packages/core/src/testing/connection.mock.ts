import { AbstractRepository, EntityManager, Repository } from 'typeorm';

import { Type } from '@vendure/common/shared-types';

import { MockClass } from './testing-types';

/**
 * A mock of the TypeORM Connection class for use in testing.
 */
export class MockConnection {
    manager: MockEntityManager;

    private repositoryMap = new Map<Type<any>, any>();

    constructor() {
        this.manager = new MockEntityManager();
        this.manager.connection = this;
    }

    registerMockRepository<T extends Type<any>>(entity: T): MockRepository<T> {
        const repository = new MockRepository();
        this.repositoryMap.set(entity, repository);
        return repository;
    }

    getRepository<T extends Type<any>>(entity: T): MockRepository<T> {
        const repository = this.repositoryMap.get(entity);
        if (repository) {
            return repository;
        } else {
            throw new Error(
                `No mock repository registered for "${entity.name}". Use registerRepository() first.`,
            );
        }
    }
}

export class MockRepository<T> implements MockClass<Repository<T>> {
    manager: any;
    metadata: any;
    queryRunner: any;
    target: any;
    createQueryBuilder = jest.fn();
    hasId = jest.fn();
    getId = jest.fn();
    create = jest.fn();
    merge = jest.fn();
    preload = jest.fn();
    save = jest.fn();
    remove = jest.fn();
    insert = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    count = jest.fn();
    find = jest.fn();
    findAndCount = jest.fn();
    findByIds = jest.fn();
    findOne = jest.fn();
    findOneOrFail = jest.fn();
    query = jest.fn();
    clear = jest.fn();
    increment = jest.fn();
    decrement = jest.fn();
}

export class MockEntityManager implements MockClass<EntityManager> {
    connection: any = {};
    queryRunner: any = {};
    transaction = jest.fn();
    query = jest.fn();
    createQueryBuilder = jest.fn();
    hasId = jest.fn();
    getId = jest.fn();
    create = jest.fn();
    merge = jest.fn();
    preload = jest.fn();
    save = jest.fn();
    remove = jest.fn();
    insert = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    count = jest.fn();
    find = jest.fn();
    findAndCount = jest.fn();
    findByIds = jest.fn();
    findOne = jest.fn();
    findOneOrFail = jest.fn();
    clear = jest.fn();
    increment = jest.fn();
    decrement = jest.fn();
    getRepository = jest.fn();
    getTreeRepository = jest.fn();
    getMongoRepository = jest.fn();
    getCustomRepository = jest.fn();
    release = jest.fn();
}
