import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';
import { useState } from 'react';
import { Asset, AssetGallery } from './asset-gallery.js';

interface AssetPickerDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (assets: Asset[]) => void;
    multiSelect?: boolean;
    initialSelectedAssets?: Asset[];
    title?: string;
}

export function AssetPickerDialog({
    open,
    onClose,
    onSelect,
    multiSelect = false,
    initialSelectedAssets = [],
    title = 'Select Assets',
}: AssetPickerDialogProps) {
    const [selectedAssets, setSelectedAssets] = useState<Asset[]>(initialSelectedAssets);

    const handleAssetSelect = (assets: Asset[]) => {
        setSelectedAssets(assets);
    };

    const handleConfirm = () => {
        onSelect(selectedAssets);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] h-[85vh] p-0 flex flex-col">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>{multiSelect ? title : title.replace('Assets', 'Asset')}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 pt-1">
                    <AssetGallery
                        onSelect={handleAssetSelect}
                        multiSelect="manual"
                        initialSelectedAssets={initialSelectedAssets}
                        fixedHeight={false}
                        displayBulkActions={false}
                    />
                </div>

                <DialogFooter className="px-6 pb-6 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedAssets.length === 0}>
                        {selectedAssets.length > 0 && multiSelect
                            ? `Select ${selectedAssets.length} Asset${selectedAssets.length > 1 ? 's' : ''}`
                            : 'Select Asset'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
