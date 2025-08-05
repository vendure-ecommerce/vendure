import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/vdb/lib/utils";

export interface GridLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
}

export interface GridLayoutProps {
    children: React.ReactElement[];
    layouts: GridLayout[];
    onLayoutChange?: (layouts: GridLayout[]) => void;
    cols?: number;
    rowHeight?: number;
    isDraggable?: boolean;
    isResizable?: boolean;
    className?: string;
    gutter?: number;
}

interface GridItemProps {
    layout: GridLayout;
    children: React.ReactNode;
    isDraggable?: boolean;
    isResizable?: boolean;
    onLayoutChange?: (layout: GridLayout) => void;
    onInteractionStart?: () => void;
    onInteractionEnd?: () => void;
    cols?: number;
    rowHeight?: number;
    gutter?: number;
}

function GridItem({
    layout,
    children,
    isDraggable = false,
    isResizable = false,
    onLayoutChange,
    onInteractionStart,
    onInteractionEnd,
    cols = 12,
    rowHeight = 100,
    gutter = 10,
}: GridItemProps) {
    const [isResizing, setIsResizing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 });
    const itemRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!isDraggable || isResizing) return;
        e.preventDefault();
        e.stopPropagation();
        
        const rect = itemRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        setIsDragging(true);
        onInteractionStart?.();
        setDragStart({
            x: layout.x,
            y: layout.y,
            mouseX: e.clientX,
            mouseY: e.clientY,
        });
    }, [isDraggable, isResizing, layout.x, layout.y, onInteractionStart]);

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        if (!isResizable) return;
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        onInteractionStart?.();
        setDragStart({
            x: layout.w,
            y: layout.h,
            mouseX: e.clientX,
            mouseY: e.clientY,
        });
    }, [isResizable, layout.w, layout.h, onInteractionStart]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!itemRef.current) return;
            
            const containerRect = itemRef.current.parentElement?.getBoundingClientRect();
            if (!containerRect) return;
            
            const colWidth = (containerRect.width - gutter * (cols - 1)) / cols;
            
            if (isDragging && onLayoutChange) {
                const deltaX = e.clientX - dragStart.mouseX;
                const deltaY = e.clientY - dragStart.mouseY;
                
                const newX = Math.round(dragStart.x + deltaX / colWidth);
                const newY = Math.round(dragStart.y + deltaY / rowHeight);
                
                onLayoutChange({
                    ...layout,
                    x: Math.max(0, Math.min(cols - layout.w, newX)),
                    y: Math.max(0, newY),
                });
            } else if (isResizing && onLayoutChange) {
                const deltaX = e.clientX - dragStart.mouseX;
                const deltaY = e.clientY - dragStart.mouseY;
                
                const newW = Math.round(dragStart.x + deltaX / colWidth);
                const newH = Math.round(dragStart.y + deltaY / rowHeight);
                
                onLayoutChange({
                    ...layout,
                    w: Math.max(1, Math.min(cols - layout.x, newW)),
                    h: Math.max(1, newH),
                });
            }
        };

        const handleMouseUp = () => {
            if (isDragging || isResizing) {
                onInteractionEnd?.();
            }
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, dragStart, layout, onLayoutChange, onInteractionEnd, cols, rowHeight]);

    const colWidth = `calc((100% - ${gutter * (cols - 1)}px) / ${cols})`;
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `calc(${layout.x} * (${colWidth} + ${gutter}px))`,
        top: `calc(${layout.y} * (${rowHeight}px + ${gutter}px))`,
        width: `calc(${layout.w} * ${colWidth} + ${(layout.w - 1) * gutter}px)`,
        height: `calc(${layout.h} * ${rowHeight}px + ${(layout.h - 1) * gutter}px)`,
        zIndex: isDragging || isResizing ? 1000 : 10, // Normal widgets above grid (10), active widget much higher (1000)
    };

    return (
        <div
            ref={itemRef}
            style={style}
            className={cn(
                "transition-shadow",
                isDraggable && !isResizing && "cursor-move",
                (isDragging || isResizing) && "shadow-lg",
            )}
            onMouseDown={handleMouseDown}
        >
            <div className="h-full w-full">
                {children}
            </div>
            {isResizable && (
                <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors"
                    style={{
                        clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
                    }}
                    onMouseDown={handleResizeStart}
                />
            )}
        </div>
    );
}

export function GridLayout({
    children,
    layouts,
    onLayoutChange,
    cols = 12,
    rowHeight = 100,
    isDraggable = false,
    isResizable = false,
    className,
    gutter = 10,
}: GridLayoutProps) {
    const [showGrid, setShowGrid] = useState(false);
    const maxRow = Math.max(...layouts.map(l => l.y + l.h), 4); // Minimum 4 rows
    const containerHeight = maxRow * rowHeight + (maxRow - 1) * gutter;

    const handleItemLayoutChange = useCallback((newLayout: GridLayout) => {
        if (onLayoutChange) {
            const newLayouts = layouts.map(l => 
                l.i === newLayout.i ? newLayout : l
            );
            onLayoutChange(newLayouts);
        }
    }, [layouts, onLayoutChange]);

    const handleInteractionStart = useCallback(() => {
        console.log('handleInteractionStart called'); // Debug log
        setShowGrid(true);
    }, []);

    const handleInteractionEnd = useCallback(() => {
        console.log('handleInteractionEnd called'); // Debug log
        setShowGrid(false);
    }, []);

    // Create grid overlay
    const renderGridOverlay = () => {
        console.log('renderGridOverlay called, showGrid:', showGrid); // Debug log
        if (!showGrid) return null;
        
        const gridCells = [];
        for (let row = 0; row < maxRow; row++) {
            for (let col = 0; col < cols; col++) {
                const colWidth = `calc((100% - ${gutter * (cols - 1)}px) / ${cols})`;
                const cellStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: `calc(${col} * (${colWidth} + ${gutter}px))`,
                    top: `calc(${row} * (${rowHeight}px + ${gutter}px))`,
                    width: colWidth,
                    height: `${rowHeight}px`,
                    pointerEvents: 'none',
                    zIndex: 0, // Behind widgets but above background
                    boxSizing: 'border-box',
                };
                
                gridCells.push(
                    <div
                        key={`grid-${row}-${col}`}
                        style={cellStyle}
                        className="transition-opacity duration-200 border-2 border-dashed border-primary bg-primary/10"
                    />
                );
            }
        }
        
        console.log('Grid cells created:', gridCells.length); // Debug log
        return gridCells;
    };

    return (
        <div
            className={cn("relative w-full bg-muted/10", className)}
            style={{ 
                height: `${containerHeight}px`,
                backgroundImage: `
                    linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: `${100 / cols}% ${rowHeight}px`,
            }}
        >
            {children.map((child, index) => {
                const layout = layouts[index];
                if (!layout) return null;

                return (
                    <GridItem
                        key={layout.i}
                        layout={layout}
                        isDraggable={isDraggable}
                        isResizable={isResizable}
                        onLayoutChange={handleItemLayoutChange}
                        onInteractionStart={handleInteractionStart}
                        onInteractionEnd={handleInteractionEnd}
                        cols={cols}
                        rowHeight={rowHeight}
                        gutter={gutter}
                    >
                        {child}
                    </GridItem>
                );
            })}
            {renderGridOverlay()}
        </div>
    );
}