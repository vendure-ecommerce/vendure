import React, { useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { RefreshCw } from 'lucide-react';

export function RefreshButton({ onRefresh }: { onRefresh: () => void }) {
    const [isRotating, setIsRotating] = useState(false);

    const handleClick = () => {
        if (!isRotating) {
            setIsRotating(true);
            onRefresh();
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
        >
            <RefreshCw onAnimationEnd={() => setIsRotating(false)}
                       className={isRotating ? 'animate-rotate' : ''} />
        </Button>
    );
}
