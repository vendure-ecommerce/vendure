import { Button } from '@/vdb/components/ui/button.js';
import { useSearchContext } from '@/vdb/providers/search-provider.js';
import { Search } from 'lucide-react';

export function SearchTrigger() {
    const { setIsCommandPaletteOpen } = useSearchContext();

    return (
        <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 justify-start text-muted-foreground"
            onClick={() => setIsCommandPaletteOpen(true)}
        >
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-flex">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex ml-auto">
                <span className="text-xs">⌘</span>K
            </kbd>
        </Button>
    );
}