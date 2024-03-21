import { ManipulationSettings, QuoteKind } from 'ts-morph';

export const defaultManipulationSettings: Partial<ManipulationSettings> = {
    quoteKind: QuoteKind.Single,
    useTrailingCommas: true,
};

export const AdminUiExtensionTypeName = 'AdminUiExtension';
export const Messages = {
    NoPluginsFound: `No plugins were found in this project. Create a plugin first by selecting "[Plugin] Add a new plugin"`,
};
