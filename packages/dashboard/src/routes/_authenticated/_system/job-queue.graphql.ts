import { graphql } from '@/graphql/graphql.js';

export const jobInfoFragment = graphql(`
    fragment JobInfo on Job {
        id
        queueName
        createdAt
        startedAt
        settledAt
        state
        isSettled
        progress
        duration
        data
        result
        error
        retries
        attempts
    }
`);

export const jobListDocument = graphql(
    `
        query JobList($options: JobListOptions) {
            jobs(options: $options) {
                items {
                    ...JobInfo
                }
                totalItems
            }
        }
    `,
    [jobInfoFragment],
);
