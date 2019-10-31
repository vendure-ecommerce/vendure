import { InitialData } from '@vendure/core';

/**
 * Creates a mutable version of a type with readonly properties.
 */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export interface TestServerOptions {
    dataDir: string;
    productsCsvPath: string;
    initialData: InitialData;
    customerCount?: number;
    logging?: boolean;
}
