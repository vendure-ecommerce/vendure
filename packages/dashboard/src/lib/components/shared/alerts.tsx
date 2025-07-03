import { useAlerts } from '@/vdb/framework/alert/alert-extensions.js';
import { AlertItem } from '@/vdb/framework/alert/alert-item.js';
import { AlertsIndicator } from '@/vdb/framework/alert/alerts-indicator.js';
import { BellIcon } from 'lucide-react';
import { Button } from '../ui/button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog.js';
import { ScrollArea } from '../ui/scroll-area.js';

export function Alerts() {
    const { alerts } = useAlerts();

    if (alerts.length === 0) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="relative">
                    <BellIcon />
                    <AlertsIndicator />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alerts</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[500px]">
                    <div className="flex flex-col divide-y divide-border">
                        {alerts.map(alert => (
                            <AlertItem className="py-2" key={alert.id} alert={alert} />
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
