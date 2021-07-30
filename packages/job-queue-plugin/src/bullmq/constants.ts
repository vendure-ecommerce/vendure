export const loggerCtx = 'BullMQJobQueuePlugin';
export const BULLMQ_PLUGIN_OPTIONS = Symbol('BULLMQ_PLUGIN_OPTIONS');

export const ALL_JOB_TYPES = [
    'completed',
    'failed',
    'delayed',
    'repeat',
    'waiting-children',
    'active',
    'wait',
    'paused',
];
