import { Type } from '@vendure/common/lib/shared-types';
import { AbstractRepository, EntityManager, Repository } from 'typeorm';

import { MockClass } from './testing-types';

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
    softDelete = jest.fn();
    softRemove = jest.fn();
    restore = jest.fn();
    recover = jest.fn();
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
