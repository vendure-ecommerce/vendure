import { graphql } from '@/vdb/graphql/graphql.js';

export const orderChartDataQuery = graphql(`
    query GetOrderChartData($refresh: Boolean, $types: [MetricType!]!) {
        metricSummary(input: { interval: Daily, types: $types, refresh: $refresh }) {
            interval
            type
            entries {
                label
                value
            }
        }
    }
`);
