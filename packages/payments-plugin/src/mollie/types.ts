export interface MolliePaymentMetadata {
    amount: number;
    status: 'Authorized' | 'Settled';
    paymentId: string;
    mode?: 'test' | 'live';
    method?: string;
    profileId?: string;
    authorizedAt?: string;
    paidAt?: string;
}
