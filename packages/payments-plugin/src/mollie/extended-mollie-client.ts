import createMollieClient, { MollieClient, Order as MollieOrder } from '@mollie/api-client';
import { Amount } from '@mollie/api-client/dist/types/src/data/global';
// We depend on the axios dependency from '@mollie/api-client'
import axios, { AxiosInstance } from 'axios';
import { create } from 'domain';

/**
 * Create an extended Mollie client that also supports the manage order lines endpoint, because
 * the NodeJS client doesn't support it yet.
 *
 * See https://docs.mollie.com/reference/v2/orders-api/manage-order-lines
 * FIXME: Remove this when the NodeJS client supports it.
 */
export function createExtendedMollieClient(options: {apiKey: string}): ExtendedMollieClient {
    const client = createMollieClient(options) as ExtendedMollieClient;
    // Add our custom method
    client.manageOrderLines = async (orderId: string, input: ManageOrderLineInput): Promise<MollieOrder> => {
        const instance = axios.create({
            baseURL: `https://api.mollie.com`,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${options.apiKey}`,
            },
            validateStatus: () => true, // We handle errors ourselves, for better error messages
        });
        const {status, data} = await instance.patch(`/v2/orders/${orderId}/lines`, input);
        if (status < 200 || status > 300) {
            throw Error(JSON.stringify(data, null, 2))
        }
        return data;
    }
    return client;
}


export interface ExtendedMollieClient extends MollieClient {
    /**
    * Update all order lines in 1 request.
    */
    manageOrderLines(orderId: string, input: ManageOrderLineInput): Promise<MollieOrder>;
}

interface CancelOperation {
    operation: 'cancel';
    data: { id: string }
}

interface UpdateOperation {
    operation: 'update';
    data: {
        id: string
        name?: string
        quantity?: number,
        unitPrice?: Amount
        totalAmount?: Amount
        vatRate?: string
        vatAmount?: Amount
    }
}

interface AddOperation {
    operation: 'add';
    data: {
        name: string
        quantity: number,
        unitPrice: Amount
        totalAmount: Amount
        vatRate: string
        vatAmount: Amount
    }
}

export interface ManageOrderLineInput {
    operations: Array<CancelOperation | AddOperation | UpdateOperation>
}
