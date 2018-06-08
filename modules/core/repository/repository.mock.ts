import { AbstractRepository, Repository } from 'typeorm';
import { MockClass } from '../testing/testing-types';
import { ProductRepository } from './product-repository';
import { ProductVariantRepository } from './product-variant-repository';

export interface Type<T> {
    new (): T;
}

/**
 * A mock of the TypeORM Connection class for use in testing.
 */
export class MockConnection {
    private customRepositoryMap = new Map<Type<AbstractRepository<any>>, any>([
        [ProductRepository, new MockProductRepository()],
        [ProductVariantRepository, new MockProductVariantRepository()],
    ]);
    private repositoryMap = new Map<Type<any>, any>();

    constructor() {}

    registerMockCustomRepository(token: Type<AbstractRepository<any>>, use: AbstractRepository<any>): void {
        this.customRepositoryMap.set(token, use);
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
            throw new Error(`No mock repository registered for "${entity.name}". Use registerRepository() first.`);
        }
    }

    getCustomRepository<T extends AbstractRepository<any>>(customRepository: Type<T>): MockClass<T> {
        const repository = this.customRepositoryMap.get(customRepository);
        if (repository) {
            return repository;
        } else {
            throw new Error(
                `No mock repository registered for "${customRepository.name}". Use registerCustomRepository() first.`,
            );
        }
    }
}

const stubReturningPromise = () => jest.fn().mockReturnValue(Promise.resolve({}));

export class MockProductRepository implements MockClass<ProductRepository> {
    find = stubReturningPromise();
    findOne = stubReturningPromise();
    create = stubReturningPromise();
}

export class MockProductVariantRepository implements MockClass<ProductVariantRepository> {
    localeFindByProductId = stubReturningPromise();
    create = stubReturningPromise();
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

class MockProductOptionGroupRepository {
    find = jest.fn();
}
