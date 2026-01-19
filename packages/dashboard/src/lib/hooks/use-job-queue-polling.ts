import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

const jobListForPollingDocument = graphql(`
    query JobListForPolling($options: JobListOptions) {
        jobs(options: $options) {
            items {
                id
                createdAt
                state
            }
            totalItems
        }
    }
`);

/**
 * Hook to poll a job queue until jobs complete.
 * Waits for jobs created after polling starts to settle before calling onComplete.
 */
export function useJobQueuePolling(queueName: string, onComplete: () => void, startImmediately = false) {
    const [isPolling, setIsPolling] = useState(false);
    const startTimeRef = useRef<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasAutoStartedRef = useRef(false);

    const { data: jobsData } = useQuery({
        queryKey: ['jobQueuePolling', queueName],
        queryFn: () =>
            api.query(jobListForPollingDocument, {
                options: {
                    filter: { queueName: { eq: queueName } },
                    sort: { createdAt: 'DESC' as const },
                    take: 10,
                },
            }),
        enabled: isPolling,
        refetchInterval: isPolling ? 500 : false,
    });

    // Detect job completion
    useEffect(() => {
        const startTime = startTimeRef.current;
        if (!isPolling || !startTime) return;

        const relevantJobs = jobsData?.jobs.items.filter(j => j.createdAt >= startTime) ?? [];
        const hasSettledJob =
            relevantJobs.length > 0 &&
            relevantJobs.every(j => j.state !== 'PENDING' && j.state !== 'RUNNING');

        if (hasSettledJob) {
            setIsPolling(false);
            startTimeRef.current = null;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            onComplete();
        }
    }, [jobsData, isPolling, onComplete]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const startPolling = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // Look back 5 seconds to catch jobs created before the mutation returned
        startTimeRef.current = new Date(Date.now() - 5000).toISOString();
        setIsPolling(true);
        // Safety fallback: max 30 seconds
        timeoutRef.current = setTimeout(() => {
            setIsPolling(false);
            startTimeRef.current = null;
            onComplete();
        }, 30000);
    }, [onComplete]);

    // Auto-start polling if requested
    useEffect(() => {
        if (startImmediately && !hasAutoStartedRef.current) {
            hasAutoStartedRef.current = true;
            startPolling();
        }
    }, [startImmediately, startPolling]);

    return { isPolling, startPolling };
}
