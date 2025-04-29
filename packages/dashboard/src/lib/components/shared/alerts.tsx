import { BellIcon } from 'lucide-react';
import { Button } from '../ui/button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog.js';

export function Alerts() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <BellIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alerts</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
