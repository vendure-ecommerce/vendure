import gql from 'graphql-tag';

export const adminApiExtensions = gql`
    type MetricSummary {
        interval: MetricInterval!
        type: MetricType!
        title: String!
        entries: [MetricSummaryEntry!]!
    }
    enum MetricInterval {
        Daily
    }
    enum MetricType {
        OrderCount
        OrderTotal
        AverageOrderValue
    }
    type MetricSummaryEntry {
        label: String!
        value: Float!
    }
    input MetricSummaryInput {
        interval: MetricInterval!
        types: [MetricType!]!
        refresh: Boolean
    }
    extend type Query {
        """
        Get metrics for the given interval and metric types.
        """
        metricSummary(input: MetricSummaryInput): [MetricSummary!]!
    }
`;
