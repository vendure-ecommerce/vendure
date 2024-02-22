import { ManipulationSettings, NewLineKind, QuoteKind } from 'ts-morph';

export const defaultManipulationSettings: Partial<ManipulationSettings> = {
    quoteKind: QuoteKind.Single,
    useTrailingCommas: true,
    newLineKind: NewLineKind.LineFeed,
};
