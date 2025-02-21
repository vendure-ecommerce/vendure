import { DocumentNode } from 'graphql';

export interface PageConfig {
    title: string;
}

export interface ListViewConfig extends PageConfig {
    listQuery: DocumentNode;
}

// export function defineListView(config: ListViewConfig) {}
