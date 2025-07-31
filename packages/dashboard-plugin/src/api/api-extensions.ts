import gql from 'graphql-tag';

export const adminApiExtensions = gql`
    type DashboardMetricSummary {
        interval: DashboardMetricInterval!
        type: DashboardMetricType!
        title: String!
        entries: [DashboardMetricSummaryEntry!]!
    }
    enum DashboardMetricInterval {
        Daily
    }
    enum DashboardMetricType {
        OrderCount
        OrderTotal
        AverageOrderValue
    }
    type DashboardMetricSummaryEntry {
        label: String!
        value: Float!
    }
    input DashboardMetricSummaryInput {
        interval: DashboardMetricInterval!
        types: [DashboardMetricType!]!
        refresh: Boolean
    }
    extend type Query {
        """
        Get dashboard metrics for the given interval and metric types.
        """
        dashboardMetricSummary(input: DashboardMetricSummaryInput): [DashboardMetricSummary!]!
    }
`;
