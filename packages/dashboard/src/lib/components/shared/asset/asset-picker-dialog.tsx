import React, { useState } from 'react';
import { AssetGallery, Asset } from './asset-gallery.js';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog.js';
import { Button } from '@/components/ui/button.js';

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
  title = "Select Assets",
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
      <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{multiSelect ? title : title.replace('Assets', 'Asset')}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow py-4">
          <AssetGallery 
            onSelect={handleAssetSelect}
            multiSelect='manual'
            initialSelectedAssets={initialSelectedAssets}
            fixedHeight={true}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedAssets.length === 0}
          >
            {selectedAssets.length > 0 && multiSelect 
              ? `Select ${selectedAssets.length} Asset${selectedAssets.length > 1 ? 's' : ''}`
              : 'Select Asset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}