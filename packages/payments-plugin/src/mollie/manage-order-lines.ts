import { Order as MollieOrder } from '@mollie/api-client';
import { Amount } from '@mollie/api-client/dist/types/src/data/global';
// We depend on the axios dependency from '@mollie/api-client'
import axios, { AxiosInstance } from 'axios';

interface CancelOperation {
    operation: 'cancel';
    data: { id: string }
}

interface UpdateOrAddOperation {
    operation: 'update' | 'add';
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
    orderId: string
    operations: Array<CancelOperation | UpdateOrAddOperation>
}

/**
 * Update all order lines in 1 request.
 * This function isn't implemented in the NodeJS SDK yet.
 * See https://docs.mollie.com/reference/v2/orders-api/manage-order-lines
 * FIXME: Remove this when the NodeJS client supports it.
 */
export async function manageOrderLines(apiKey: string, input: ManageOrderLineInput): Promise<MollieOrder> {
    const instance = axios.create({
        baseURL: `https://api.mollie.com`,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${apiKey}`,
        },
        validateStatus: () => true,
    });
    const result = await instance.patch(`/v2/orders/${input.orderId}/lines`, input.operations);
    return result.data;

}