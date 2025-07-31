export type DashboardMetricSummary = {
    interval: DashboardMetricInterval;
    type: DashboardMetricType;
    title: string;
    entries: DashboardMetricSummaryEntry[];
};

export enum DashboardMetricType {
    OrderCount = 'OrderCount',
    OrderTotal = 'OrderTotal',
    AverageOrderValue = 'AverageOrderValue',
}

export enum DashboardMetricInterval {
    Daily = 'Daily',
}

export type DashboardMetricSummaryEntry = {
    label: string;
    value: number;
};

export interface DashboardMetricSummaryInput {
    interval: DashboardMetricInterval;
    types: DashboardMetricType[];
    refresh?: boolean;
}
