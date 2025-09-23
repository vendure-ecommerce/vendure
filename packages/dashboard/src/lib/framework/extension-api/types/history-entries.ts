import React from 'react';

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

export interface HistoryEntryProps {
    entry: HistoryEntryItem;
    title: string | React.ReactNode;
    timelineIcon: React.ReactNode;
    timelineIconClassName?: string;
    actorName?: string;
    children: React.ReactNode;
    isPrimary?: boolean;
}

export interface DashboardHistoryEntryComponent {
    type: string;
    component: React.ComponentType<HistoryEntryProps>;
}
