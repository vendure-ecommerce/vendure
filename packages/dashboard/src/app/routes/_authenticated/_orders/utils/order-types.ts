import { ResultOf } from '@/vdb/graphql/graphql.js';

import { orderDetailDocument } from '../orders.graphql.js';

export type Order = NonNullable<ResultOf<typeof orderDetailDocument>['order']>;
export type Payment = NonNullable<NonNullable<Order>['payments']>[number];
export type Fulfillment = NonNullable<NonNullable<Order>['fulfillments']>[number];
