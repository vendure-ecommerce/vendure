import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySchema, getRepository, ObjectType, Repository } from 'typeorm';
import { RepositoryFactory } from 'typeorm/repository/RepositoryFactory';

import { RequestContext } from '../../api/common/request-context';
import { TRANSACTION_MANAGER_KEY } from '../../common/constants';

/**
 * @description
 * The TransactionalConnection is a wrapper around the TypeORM `Connection` object which works in conjunction
 * with the {@link Transaction} decorator to implement per-request transactions. All services which access the
 * database should use this class rather than the raw TypeORM connection, to ensure that db changes can be
 * easily wrapped in transactions when required.
 *
 * The service layer does not need to know about the scope of a transaction, as this is covered at the
 * API by the use of the `Transaction` decorator.
 *
 * @docsCategory data-access
 */
@Injectable()
export class TransactionalConnection {
    constructor(@InjectConnection() private connection: Connection) {}

    /**
     * @description
     * The plain TypeORM Connection object. Should be used carefully as any operations
     * performed with this connection will not be performed within any outer
     * transactions.
     */
    get rawConnection(): Connection {
        return this.connection;
    }

    /**
     * @description
     * Gets a repository bound to the current transaction manager
     * or defaults to the current connection's call to getRepository().
     */
    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Repository<Entity>;
    getRepository<Entity>(
        ctx: RequestContext,
        target: ObjectType<Entity> | EntitySchema<Entity> | string,
    ): Repository<Entity>;
    getRepository<Entity>(
        ctxOrTarget: RequestContext | ObjectType<Entity> | EntitySchema<Entity> | string,
        maybeTarget?: ObjectType<Entity> | EntitySchema<Entity> | string,
    ): Repository<Entity> {
        if (ctxOrTarget instanceof RequestContext) {
            const transactionManager = (ctxOrTarget as any)[TRANSACTION_MANAGER_KEY];
            if (transactionManager && maybeTarget) {
                const metadata = this.connection.getMetadata(maybeTarget);
                return new RepositoryFactory().create(transactionManager, metadata);
            } else {
                // tslint:disable-next-line:no-non-null-assertion
                return getRepository(maybeTarget!);
            }
        } else {
            return getRepository(ctxOrTarget);
        }
    }
}
