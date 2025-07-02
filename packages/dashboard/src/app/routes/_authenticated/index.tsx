import { Button } from '@/vdb/components/ui/button.js';
import { DashboardWidgetInstance } from '@/vdb/framework/dashboard-widget/types.js';
import {
    getDashboardWidget,
    getDashboardWidgetRegistry,
} from '@/vdb/framework/dashboard-widget/widget-extensions.js';
import {
    FullWidthPageBlock,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const Route = createFileRoute('/_authenticated/')({
    component: DashboardPage,
});

const findNextPosition = (
    existingWidgets: DashboardWidgetInstance[],
    newWidgetSize: { w: number; h: number },
) => {
    // Create a set of all occupied cells
    const occupied = new Set();
    let maxExistingRow = 0;

    existingWidgets.forEach(widget => {
        const { x, y, w, h } = widget.layout;
        // Track the maximum row used by existing widgets
        maxExistingRow = Math.max(maxExistingRow, y + h);

        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                occupied.add(`${i},${j}`);
            }
        }
    });

    // Search up to 3 rows past the last occupied row
    const maxSearchRows = maxExistingRow + 3;

    // Find first position where the widget fits
    for (let y = 0; y < maxSearchRows; y++) {
        for (let x = 0; x < 12 - (newWidgetSize.w || 1); x++) {
            let fits = true;
            // Check if all cells needed for this widget are free
            for (let i = x; i < x + (newWidgetSize.w || 1); i++) {
                for (let j = y; j < y + (newWidgetSize.h || 1); j++) {
                    if (occupied.has(`${i},${j}`)) {
                        fits = false;
                        break;
                    }
                }
                if (!fits) break;
            }
            if (fits) {
                return { x, y };
            }
        }
    }
    // If no space found, place it in the next row after all existing widgets
    return { x: 0, y: maxExistingRow };
};

function DashboardPage() {
    const [widgets, setWidgets] = useState<DashboardWidgetInstance[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [layoutWidth, setLayoutWidth] = useState<number | undefined>(undefined);
    const layoutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!layoutRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                setLayoutWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(layoutRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const initialWidgets = Array.from(getDashboardWidgetRegistry().entries()).reduce(
            (acc: DashboardWidgetInstance[], [id, widget]) => {
                const layout = {
                    ...widget.defaultSize,
                    x: widget.defaultSize.x ?? 0,
                    y: widget.defaultSize.y ?? 0,
                };

                // If x or y is not set, find the next available position
                if (widget.defaultSize.x === undefined || widget.defaultSize.y === undefined) {
                    const pos = findNextPosition(acc, {
                        w: widget.defaultSize.w || 1,
                        h: widget.defaultSize.h || 1,
                    });
                    layout.x = pos.x;
                    layout.y = pos.y;
                }

                return [
                    ...acc,
                    {
                        id,
                        widgetId: id,
                        layout,
                    },
                ];
            },
            [],
        );

        setWidgets(initialWidgets);
    }, []);

    const handleLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        setWidgets(prev =>
            prev.map((widget, i) => ({
                ...widget,
                layout: layout[i],
            })),
        );
    };

    const memoizedLayoutGrid = useMemo(() => {
        return (
            layoutWidth && (
                <ResponsiveGridLayout
                    className="overflow-hidden"
                    key={layoutWidth}
                    width={layoutWidth}
                    layouts={{ lg: widgets.map(w => ({ ...w.layout, i: w.id })) }}
                    onLayoutChange={handleLayoutChange}
                    cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={100}
                    isDraggable={editMode}
                    isResizable={editMode}
                    autoSize={true}
                    innerRef={layoutRef}
                    transformScale={0.9}
                >
                    {widgets.map(widget => {
                        const definition = getDashboardWidget(widget.widgetId);
                        if (!definition) return null;
                        const WidgetComponent = definition.component;

                        return (
                            <div key={widget.id}>
                                <WidgetComponent id={widget.id} config={widget.config} />
                            </div>
                        );
                    })}
                </ResponsiveGridLayout>
            )
        );
    }, [layoutWidth, editMode, widgets]);

    return (
        <Page pageId="dashboard">
            <PageTitle>Dashboard</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button variant="outline" onClick={() => setEditMode(prev => !prev)}>
                        Edit Mode
                        {editMode ? (
                            <span className="text-xs text-destructive">ON</span>
                        ) : (
                            <span className="text-xs text-muted-foreground">OFF</span>
                        )}
                    </Button>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <FullWidthPageBlock blockId="widgets">
                    <div ref={layoutRef} className="h-full w-full">
                        {memoizedLayoutGrid}
                    </div>
                </FullWidthPageBlock>
            </PageLayout>
        </Page>
    );
}
