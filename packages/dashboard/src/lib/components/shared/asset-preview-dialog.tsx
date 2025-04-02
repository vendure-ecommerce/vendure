import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.js';
import { AssetWithTags, AssetPreview } from './asset-preview.js';

interface AssetPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset: AssetWithTags;
    assets?: AssetWithTags[];
    editable?: boolean;
    customFields?: any[];
    onAssetChange?: (asset: Partial<AssetWithTags>) => void;
}

export function AssetPreviewDialog({
    open,
    onOpenChange,
    asset,
    assets,
    editable,
    customFields,
    onAssetChange,
}: AssetPreviewDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] lg:max-w-[95vw] w-[95vw] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Asset</DialogTitle>
                    <DialogDescription>Description goes here</DialogDescription>
                </DialogHeader>
                <div className="h-full p-6">
                    <AssetPreview
                        asset={asset}
                        assets={assets}
                        editable={editable}
                        customFields={customFields}
                        onAssetChange={onAssetChange}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
