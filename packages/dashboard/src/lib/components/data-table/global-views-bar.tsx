import { ColumnFiltersState } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { useSavedViews } from '../../hooks/use-saved-views.js';
import { SavedView } from '../../types/saved-views.js';
import { Trans } from '../../lib/trans.js';
import { findMatchingSavedView } from '../../utils/saved-views-utils.js';
import { PermissionGuard } from '../shared/permission-guard.js';
import { Button } from '../ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu.js';
import { ManageGlobalViewsButton } from './manage-global-views-button.js';

interface GlobalViewsBarProps {
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
    currentFilters?: ColumnFiltersState;
    currentSearchTerm?: string;
}

export const GlobalViewsBar: React.FC<GlobalViewsBarProps> = ({
    onApplyView,
    currentFilters = [],
    currentSearchTerm = ''
}) => {
    const { globalViews, canManageGlobalViews } = useSavedViews();

    if (globalViews.length === 0) {
        return null;
    }

    // Sort by creation date (oldest first)
    const sortedViews = [...globalViews].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const handleApplyView = (view: SavedView) => {
        onApplyView(view.filters, view.searchTerm);
    };

    const isViewActive = (view: SavedView) => {
        return findMatchingSavedView(currentFilters, currentSearchTerm, [view]) !== undefined;
    };

    if (sortedViews.length <= 3) {
        // Show all views as buttons
        return (
            <div className="flex items-center gap-1">
                {sortedViews.map(view => (
                    <Button
                        key={view.id}
                        variant={isViewActive(view) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleApplyView(view)}
                    >
                        {view.name}
                    </Button>
                ))}
                {canManageGlobalViews && <ManageGlobalViewsButton onApplyView={onApplyView} />}
            </div>
        );
    }

    // Show first 3 as buttons, rest in dropdown
    const visibleViews = sortedViews.slice(0, 3);
    const dropdownViews = sortedViews.slice(3);

    return (
        <div className="flex items-center gap-1">
            {visibleViews.map(view => (
                <Button
                    key={view.id}
                    variant={isViewActive(view) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleApplyView(view)}
                >
                    {view.name}
                </Button>
            ))}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Trans>More views</Trans>
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {dropdownViews.map(view => (
                        <DropdownMenuItem
                            key={view.id}
                            onClick={() => handleApplyView(view)}
                            className={isViewActive(view) ? 'bg-primary' : ''}
                        >
                            {view.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <PermissionGuard requires={['ManageDashboardGlobalViews']}>
                {canManageGlobalViews && <ManageGlobalViewsButton onApplyView={onApplyView} />}
            </PermissionGuard>
        </div>
    );
};
