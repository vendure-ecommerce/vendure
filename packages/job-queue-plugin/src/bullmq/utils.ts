import { BullMQPluginOptions } from './types';

export function getPrefix(options: BullMQPluginOptions) {
    return options.workerOptions?.prefix ?? 'bull';
}
