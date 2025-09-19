import { ColumnFiltersState } from '@tanstack/react-table';

export interface SavedView {
    id: string;
    name: string;
    scope: 'user' | 'global';
    filters: ColumnFiltersState;
    searchTerm?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
}

export interface SavedViewsData {
    userViews: SavedView[];
    globalViews: SavedView[];
}

export interface SavedViewsStore {
    [pageId: string]: SavedView[];
}

export interface SaveViewInput {
    name: string;
    scope: 'user' | 'global';
    filters: ColumnFiltersState;
    searchTerm?: string;
}

export interface UpdateViewInput {
    id: string;
    name?: string;
    filters?: ColumnFiltersState;
    searchTerm?: string;
}
