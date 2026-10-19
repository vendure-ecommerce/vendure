import { ID } from '@vendure/common/lib/shared-types';
import { LockNotSupportedOnGivenDriverError, PessimisticLockTransactionRequiredError } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Order } from '../../../entity/order/order.entity';
import { Surcharge } from '../../../entity/surcharge/surcharge.entity';

/**
 * Locks the Order row until the current transaction ends. Every transaction which reprices an
 * Order takes this lock first, so two transactions cannot reprice the same Order at the same
 * time, and the one which commits last sees the Surcharges committed by the other.
 *
 * The lock is the one which the `UPDATE` of the Order row takes anyway, acquired earlier: on
 * Postgres that is `FOR NO KEY UPDATE`, which unlike `FOR UPDATE` does not block transactions
 * which insert an OrderLine or a Surcharge for the Order, so it cannot deadlock against them.
 * SQLite and sql.js do not support row locks; their single connection already runs one
 * transaction at a time. Outside a transaction no lock is taken, since it would be released
 * straight away.
 *
 * Returns `false` if no lock was taken.
 */
export async function lockOrderRow(
    connection: TransactionalConnection,
    ctx: RequestContext,
    orderId: ID,
): Promise<boolean> {
    const lockMode =
        connection.rawConnection.options.type === 'postgres' ? 'for_no_key_update' : 'pessimistic_write';
    try {
        await connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .select('order.id')
            .setLock(lockMode)
            .where('order.id = :orderId', { orderId })
            .getOne();
        return true;
    } catch (e) {
        if (
            e instanceof LockNotSupportedOnGivenDriverError ||
            e instanceof PessimisticLockTransactionRequiredError
        ) {
            return false;
        }
        throw e;
    }
}

/**
 * Locks the Order row (see {@link lockOrderRow}) and replaces `order.surcharges` with the
 * Surcharge rows in the database, so the totals calculated next include every Surcharge
 * attached to the Order, including any added by an event handler or a concurrent request after
 * the Order was loaded.
 *
 * The Surcharges are read with a shared lock. On MySQL and MariaDB a plain read returns the
 * snapshot taken at the first read of the transaction, which can predate a Surcharge committed
 * while this transaction waited for the Order lock; a locking read returns the latest committed
 * rows. The shared lock also blocks a concurrent delete of a Surcharge until the totals which
 * include it have been committed.
 */
export async function lockOrderAndReloadSurcharges(
    connection: TransactionalConnection,
    ctx: RequestContext,
    order: Order,
): Promise<void> {
    const locked = await lockOrderRow(connection, ctx, order.id);
    const qb = connection
        .getRepository(ctx, Surcharge)
        .createQueryBuilder('surcharge')
        .where('surcharge.orderId = :orderId', { orderId: order.id })
        .orderBy('surcharge.id', 'ASC');
    if (locked) {
        qb.setLock('pessimistic_read');
    }
    order.surcharges = await qb.getMany();
}
