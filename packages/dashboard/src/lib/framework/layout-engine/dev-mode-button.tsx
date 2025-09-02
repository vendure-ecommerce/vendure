import { Button } from '@/vdb/components/ui/button.js';
import { cn } from '@/vdb/lib/utils.js';
import { CodeXmlIcon } from 'lucide-react';
import { forwardRef } from 'react';

export const DevModeButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
    (props, ref) => {
        const { className, ...rest } = props;
        return (
            <Button
                ref={ref}
                variant="secondary"
                size="icon"
                className={cn(
                    'h-8 w-8 rounded-full bg-dev-mode/20 hover:bg-dev-mode/30 border border-dev-mode/20 shadow-sm',
                    className,
                )}
                {...rest}
            >
                <CodeXmlIcon className="text-dev-mode w-4 h-4" />
            </Button>
        );
    },
);
