import { ID } from '@vendure/common/lib/shared-types';
import { LockNotSupportedOnGivenDriverError, PessimisticLockTransactionRequiredError } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Order } from '../../../entity/order/order.entity';
import { Surcharge } from '../../../entity/surcharge/surcharge.entity';

const POSTGRES_FAMILY = ['postgres', 'aurora-postgres', 'cockroachdb'];
const MYSQL_FAMILY = ['mysql', 'mariadb', 'aurora-mysql'];
const ORDER_VERSION_COLUMNS = ['order.id', 'order.updatedAt', 'order.subTotal', 'order.subTotalWithTax'];

type OrderVersion = Pick<Order, 'id' | 'updatedAt' | 'subTotal' | 'subTotalWithTax'>;

/**
 * Locks the Order row until the current transaction ends, and returns the latest committed
 * version of the columns which change when the Order is repriced. Returns `undefined` if no lock
 * was taken.
 *
 * The lock is the one which the `UPDATE` of the Order row takes anyway, acquired earlier: on
 * Postgres that is `FOR NO KEY UPDATE`, which unlike `FOR UPDATE` does not block transactions
 * which insert an OrderLine or a Surcharge for the Order, so it cannot deadlock against them.
 * SQLite and sql.js do not support row locks; their single connection already runs one
 * transaction at a time. Outside a transaction no lock is taken, since it would be released
 * straight away.
 */
export async function lockOrderRow(
    connection: TransactionalConnection,
    ctx: RequestContext,
    orderId: ID,
): Promise<OrderVersion | undefined> {
    const dbType = connection.rawConnection.options.type;
    try {
        const row = await connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .select(ORDER_VERSION_COLUMNS)
            .setLock(POSTGRES_FAMILY.includes(dbType) ? 'for_no_key_update' : 'pessimistic_write')
            .where('order.id = :orderId', { orderId })
            .getOne();
        return row ?? undefined;
    } catch (e) {
        if (
            e instanceof LockNotSupportedOnGivenDriverError ||
            e instanceof PessimisticLockTransactionRequiredError
        ) {
            return undefined;
        }
        throw e;
    }
}

/**
 * Locks the Order row (see {@link lockOrderRow}) and replaces `order.surcharges` with the
 * Surcharge rows in the database. A transaction which reprices an Order calls this before
 * calculating the totals, so two transactions cannot calculate the totals of the same Order at the
 * same time, and the one which commits last includes the Surcharges committed by the other. Only
 * the Surcharges are reloaded: the rest of the Order is used as the caller loaded it.
 *
 * On MySQL and MariaDB (REPEATABLE READ) a plain read returns the snapshot taken at the first read
 * of the transaction, which can predate a repricing committed while this transaction waited for
 * the lock. In that case, detected by the locked Order row differing from the snapshot, the
 * Surcharges are read with a shared lock, which returns the latest committed rows. The shared lock
 * is not taken otherwise, because InnoDB also locks the index gap after the matching rows, which
 * blocks Surcharge inserts for other Orders and can deadlock against them.
 */
export async function lockOrderAndReloadSurcharges(
    connection: TransactionalConnection,
    ctx: RequestContext,
    order: Order,
): Promise<void> {
    const lockedVersion = await lockOrderRow(connection, ctx, order.id);
    let readLatest = false;
    if (lockedVersion && MYSQL_FAMILY.includes(connection.rawConnection.options.type)) {
        const snapshotVersion = await connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .select(ORDER_VERSION_COLUMNS)
            .where('order.id = :orderId', { orderId: order.id })
            .getOne();
        readLatest = !snapshotVersion || !versionsAreEqual(snapshotVersion, lockedVersion);
    }
    const qb = connection
        .getRepository(ctx, Surcharge)
        .createQueryBuilder('surcharge')
        .where('surcharge.orderId = :orderId', { orderId: order.id })
        .orderBy('surcharge.id', 'ASC');
    if (readLatest) {
        qb.setLock('pessimistic_read');
    }
    order.surcharges = await qb.getMany();
}

function versionsAreEqual(a: OrderVersion, b: OrderVersion): boolean {
    return (
        a.updatedAt?.getTime() === b.updatedAt?.getTime() &&
        a.subTotal === b.subTotal &&
        a.subTotalWithTax === b.subTotalWithTax
    );
}
