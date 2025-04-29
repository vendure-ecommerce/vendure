import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { ResultOf } from 'gql.tada';
import { PlusIcon } from 'lucide-react';
import { roleItemFragment } from '../roles.graphql.js';

export function ExpandablePermissions({ role }: { role: ResultOf<typeof roleItemFragment> }) {
    const permissionsToPreview = role.permissions.slice(0, 3);

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {permissionsToPreview.map(permission => (
                <Badge variant={'secondary'} key={permission}>
                    {permission}
                </Badge>
            ))}
            {role.permissions.length > permissionsToPreview.length && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={'xs'} variant={'secondary'}>
                            <PlusIcon /> {role.permissions.length - permissionsToPreview.length}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Permissions of {role.code}</DialogTitle>
                            <DialogDescription>
                                {role.permissions.length} permissions in total.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[300px]">
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.map(permission => (
                                    <Badge variant={'secondary'} key={permission}>
                                        {permission}
                                    </Badge>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
