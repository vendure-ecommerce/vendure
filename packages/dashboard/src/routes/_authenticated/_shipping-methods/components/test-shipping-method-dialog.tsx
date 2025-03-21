import { Button } from '@/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog.js';
import { Trans } from '@lingui/react/macro';
import { TestTube } from 'lucide-react';

export function TestShippingMethodDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <TestTube />
                    <Trans>Test shipping method</Trans>
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Test shipping method</DialogTitle>
                    <DialogDescription>
                        Test your shipping method by simulating a new order.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
