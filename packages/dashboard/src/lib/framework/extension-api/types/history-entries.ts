import { HistoryEntryProps } from '@/vdb/components/shared/history-timeline/history-entry.js';
import React from 'react';

import { OrderHistoryOrderDetail } from '../../../../app/routes/_authenticated/_orders/components/order-history/order-history-types.js';

export interface HistoryEntryItem {
    id: string;
    type: string;
    createdAt: string;
    isPublic: boolean;
    administrator?: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
    data: any;
}

export interface DashboardHistoryEntryComponent {
    type: string;
    component: React.ComponentType<{ entry: HistoryEntryProps; entity: OrderHistoryOrderDetail }>;
}
