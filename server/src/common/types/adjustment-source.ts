import { ID } from 'shared/shared-types';

export interface AdjustmentSource {
    test(): boolean;
    apply(): Adjustment[];
}

/**
 * When an AdjustmentSource is applied to an OrderItem, an Adjustment is
 * generated based on the actions assigned to the AdjustmentSource.
 */
export interface Adjustment {
    adjustmentSourceId: ID;
    description: string;
    amount: number;
}
