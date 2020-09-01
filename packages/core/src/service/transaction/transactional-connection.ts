import { Injectable, Scope } from '@nestjs/common';
import { Connection, ConnectionOptions, EntitySchema, getRepository, ObjectType, Repository } from 'typeorm';
import { RepositoryFactory } from 'typeorm/repository/RepositoryFactory';

import { UnitOfWork } from './unit-of-work';

/**
 * @description
 * The TransactionalConnection is a wrapper around the TypeORM `Connection` object which works in conjunction
 * with the {@link UnitOfWork} class to implement per-request transactions. All services which access the
 * database should use this class rather than the raw TypeORM connection, to ensure that db changes can be
 * easily wrapped in transactions when required.
 *
 * The service layer does not need to know about the scope of a transaction, as this is covered at the
 * API level depending on the nature of the request.
 *
 * Based on the pattern outlined in
 * [this article](https://aaronboman.com/programming/2020/05/15/per-request-database-transactions-with-nestjs-and-typeorm/)
 *
 * @docsCategory data-access
 */
@Injectable()
export class TransactionalConnection {
    constructor(private uow: UnitOfWork) {}

    /**
     * @description
     * The plain TypeORM Connection object. Should be used carefully as any operations
     * performed with this connection will not be performed within any outer
     * transactions.
     */
    get rawConnection(): Connection {
        return this.uow.getConnection();
    }

    /**
     * @description
     * Gets a repository bound to the current transaction manager
     * or defaults to the current connection's call to getRepository().
     */
    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Repository<Entity> {
        const transactionManager = this.uow.getTransactionManager();
        if (transactionManager) {
            const connection = this.uow.getConnection();
            const metadata = connection.getMetadata(target);
            return new RepositoryFactory().create(transactionManager, metadata);
        }
        return getRepository(target);
    }
}
