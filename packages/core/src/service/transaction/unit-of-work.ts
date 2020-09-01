import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';

/**
 * @description
 * This class is used to wrap an entire request in a database transaction. It should
 * generally be injected at the API layer and wrap the service-layer call(s) so that
 * all DB access within the `withTransaction()` method takes place within a transaction.
 *
 * @docsCategory data-access
 */
@Injectable()
export class UnitOfWork {
    private transactionManager: EntityManager | null;
    constructor(@InjectConnection() private connection: Connection) {}

    getTransactionManager(): EntityManager | null {
        return this.transactionManager;
    }

    getConnection(): Connection {
        return this.connection;
    }

    async withTransaction<T>(work: () => T): Promise<T> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.startTransaction();
        this.transactionManager = queryRunner.manager;
        try {
            const result = await work();
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
            this.transactionManager = null;
        }
    }
}
