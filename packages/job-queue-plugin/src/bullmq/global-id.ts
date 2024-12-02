// const QUEUE_ID_BITS = 12; // 12 bits for the queue ID (supports 4096 queues)
// const JOB_ID_BITS = 41; // 41 bits for the job ID (supports ~2 trillion jobs per queue)
// // eslint-disable-next-line no-bitwise
// export const MAX_QUEUE_ID = (1 << QUEUE_ID_BITS) - 1; // Max queue ID (65535)
//
// /**
//  * Combines a queueId and jobId into a single number, which will be unique across
//  * all queues.
//  *
//  * To generate globally unique integer IDs for jobs across multiple queues while being able
//  * to derive the queue and job ID from the global ID, you can combine the queue ID and job ID
//  * into a single number using bitwise operations.
//  */
// export function getGlobalId(queueId: number, jobId: number) {
//     if (queueId == null) {
//         throw new Error(`Queue not found`);
//     }
//     // eslint-disable-next-line no-bitwise
//     if (jobId >= 1 << JOB_ID_BITS) {
//         throw new Error('Job ID exceeds maximum allowed value');
//     }
//     // eslint-disable-next-line no-bitwise
//     return (queueId << JOB_ID_BITS) | jobId;
// }
//
// /**
//  * Splits a global ID into its queueId and jobId components.
//  */
// export function parseGlobalId(globalId: number) {
//     // eslint-disable-next-line no-bitwise
//     const queueId = (globalId >> JOB_ID_BITS) & MAX_QUEUE_ID;
//     // eslint-disable-next-line no-bitwise
//     const jobId = globalId & ((1 << JOB_ID_BITS) - 1);
//     return { queueId, jobId };
// }

// import { ParsedGlobalId } from './types';
// import { validateId } from './validation';

export const MAX_QUEUE_ID = Math.pow(2, 21) - 1; // 2,097,151
const SHIFT_BITS = 32;

/**
 * Combines queueId and jobId into a global identifier
 * @param queueId - The queue identifier
 * @param jobId - The job identifier
 * @returns The combined global identifier as a number
 */
export function getGlobalId(queueId: number, jobId: number): number {
    // Shift queueId left by 32 bits and combine with jobId
    return queueId * Math.pow(2, SHIFT_BITS) + jobId;
}

/**
 * Parses a global identifier back into its queueId and jobId components
 * @param globalId - The global identifier to parse
 * @returns The parsed queue and job IDs
 */
export function parseGlobalId(globalId: number) {
    // Extract queueId and jobId using bit operations
    const queueId = Math.floor(globalId / Math.pow(2, SHIFT_BITS));
    const jobId = globalId % Math.pow(2, SHIFT_BITS);

    return { queueId, jobId };
}
