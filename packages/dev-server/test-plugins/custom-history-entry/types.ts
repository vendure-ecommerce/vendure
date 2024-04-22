import { CustomerHistoryEntryData } from '@bb-vendure/core';

export const CUSTOM_TYPE = 'CUSTOM_TYPE';

declare module '@bb-vendure/core' {
    interface OrderHistoryEntryData {
        [CUSTOM_TYPE]: { message: string };
    }

    interface CustomerHistoryEntryData {
        [CUSTOM_TYPE]: { name: string };
    }
}
