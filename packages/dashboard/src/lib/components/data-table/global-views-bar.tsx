import { ChevronDown } from 'lucide-react';
import React from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useSavedViews } from '../../hooks/use-saved-views.js';
import { Button } from '../ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu.js';
import { SavedView } from '../../types/saved-views.js';

interface GlobalViewsBarProps {
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
    currentFilters?: ColumnFiltersState;
}

export const GlobalViewsBar: React.FC<GlobalViewsBarProps> = ({
    onApplyView,
    currentFilters = [],
}) => {
    const { globalViews, applyView } = useSavedViews();

    if (globalViews.length === 0) {
        return null;
    }

    // Sort by creation date (oldest first)
    const sortedViews = [...globalViews].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const handleApplyView = (view: SavedView) => {
        onApplyView(view.filters, view.searchTerm);
    };

    const isViewActive = (view: SavedView) => {
        return JSON.stringify(view.filters) === JSON.stringify(currentFilters);
    };

    if (sortedViews.length <= 3) {
        // Show all views as buttons
        return (
            <div className="flex gap-2 p-2 border-b">
                <span className="text-sm text-muted-foreground self-center mr-2">Quick Views:</span>
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
            </div>
        );
    }

    // Show first 3 as buttons, rest in dropdown
    const visibleViews = sortedViews.slice(0, 3);
    const dropdownViews = sortedViews.slice(3);

    return (
        <div className="flex gap-2 p-2 border-b">
            <span className="text-sm text-muted-foreground self-center mr-2">Quick Views:</span>
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
                        More Views
                        <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {dropdownViews.map(view => (
                        <DropdownMenuItem
                            key={view.id}
                            onClick={() => handleApplyView(view)}
                            className={isViewActive(view) ? 'bg-accent' : ''}
                        >
                            {view.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};