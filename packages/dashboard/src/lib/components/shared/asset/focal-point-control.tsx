import { cn } from '@/vdb/lib/utils.js';
import { useEffect, useState } from 'react';

export interface Point {
    x: number;
    y: number;
}

interface FocalPointControlProps {
    width: number;
    height: number;
    point: Point;
    onChange: (point: Point) => void;
}

export function FocalPointControl({ width, height, point, onChange }: Readonly<FocalPointControlProps>) {
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (!dragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = (e.target as HTMLDivElement)?.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            onChange({ x, y });
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, onChange]);

    return (
        <div className="absolute inset-0 cursor-crosshair" onMouseDown={() => setDragging(true)}>
            <div
                className={cn(
                    'absolute w-6 h-6 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2',
                    'shadow-[0_0_0_1px_rgba(0,0,0,0.3)]',
                    dragging && 'scale-75',
                )}
                style={{
                    left: `${point.x * width}px`,
                    top: `${point.y * height}px`,
                }}
            />
        </div>
    );
}
