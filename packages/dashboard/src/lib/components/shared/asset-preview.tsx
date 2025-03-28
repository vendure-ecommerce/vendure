import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader } from '@/components/ui/card.js';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { VendureImage } from '@/components/shared/vendure-image.js';
import { AssetFragment } from '@/graphql/fragments.js';
import { cn, formatFileSize } from '@/lib/utils.js';
import { ChevronLeft, ChevronRight, Crosshair, Edit, ExternalLink, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FocalPointControl } from './focal-point-control.js';

export type PreviewPreset = 'tiny' | 'thumb' | 'small' | 'medium' | 'large' | '';

interface Point {
    x: number;
    y: number;
}

export type AssetWithTags = AssetFragment & { tags?: { value: string }[] };

interface AssetPreviewProps {
    asset: AssetWithTags;
    assets?: AssetWithTags[];
    editable?: boolean;
    customFields?: any[];
    onAssetChange?: (asset: Partial<AssetWithTags>) => void;
    onEditClick?: () => void;
}

export function AssetPreview({
    asset,
    assets,
    editable = false,
    customFields = [],
    onAssetChange,
    onEditClick,
}: AssetPreviewProps) {
    const [size, setSize] = useState<PreviewPreset>('medium');
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [centered, setCentered] = useState(true);
    const [settingFocalPoint, setSettingFocalPoint] = useState(false);
    const [lastFocalPoint, setLastFocalPoint] = useState<Point>();
    const [assetIndex, setAssetIndex] = useState(assets?.indexOf(asset) || 0);

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sizePriorToFocalPoint = useRef<PreviewPreset>('medium');

    const form = useForm({
        defaultValues: {
            name: asset.name,
            tags: asset.tags?.map(t => t.value) || [],
        },
    });
    const activeAsset = assets?.[assetIndex] ?? asset;

    useEffect(() => {
        if (assets?.length) {
            const index = assets.findIndex(a => a.id === asset.id);
            setAssetIndex(index === -1 ? 0 : index);
        }
    }, [assets, asset.id]);

    useEffect(() => {
        const handleResize = () => {
            updateDimensions();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const updateDimensions = () => {
        if (!imageRef.current || !containerRef.current) return;

        const img = imageRef.current;
        const container = containerRef.current;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        if (settingFocalPoint) {
            const controlsMarginPx = 48 * 2;
            const availableHeight = containerHeight - controlsMarginPx;
            const availableWidth = containerWidth;
            const hRatio = imgHeight / availableHeight;
            const wRatio = imgWidth / availableWidth;

            if (1 < hRatio || 1 < wRatio) {
                const factor = hRatio < wRatio ? wRatio : hRatio;
                setWidth(Math.round(imgWidth / factor));
                setHeight(Math.round(imgHeight / factor));
                setCentered(true);
                return;
            }
        }

        setWidth(imgWidth);
        setHeight(imgHeight);
        setCentered(imgWidth <= containerWidth && imgHeight <= containerHeight);
    };

    const handleFocalPointStart = () => {
        sizePriorToFocalPoint.current = size;
        setSize('medium');
        setSettingFocalPoint(true);
        setLastFocalPoint(asset.focalPoint || { x: 0.5, y: 0.5 });
        updateDimensions();
    };

    const handleFocalPointChange = (point: Point) => {
        setLastFocalPoint(point);
    };

    const handleFocalPointCancel = () => {
        setSettingFocalPoint(false);
        setLastFocalPoint(undefined);
        setSize(sizePriorToFocalPoint.current);
    };

    const handleFocalPointSet = async () => {
        if (!lastFocalPoint) return;

        try {
            // TODO: Implement API call to update focal point
            await onAssetChange?.({
                id: asset.id,
                focalPoint: lastFocalPoint,
            });
            setSettingFocalPoint(false);
            setSize(sizePriorToFocalPoint.current);
            // Show success toast
        } catch (err) {
            // Show error toast
        }
    };

    const handleRemoveFocalPoint = async () => {
        try {
            // TODO: Implement API call to remove focal point
            await onAssetChange?.({
                id: asset.id,
                focalPoint: null,
            });
            // Show success toast
        } catch (err) {
            // Show error toast
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 h-full">
            <div className="space-y-4">
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {!editable && onEditClick && (
                            <Button variant="ghost" className="w-full justify-start" onClick={onEditClick}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                                <ChevronRight className="ml-auto h-4 w-4" />
                            </Button>
                        )}

                        {editable ? (
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <div>
                                <Label>Name</Label>
                                <p className="truncate text-sm text-muted-foreground">{activeAsset.name}</p>
                            </div>
                        )}

                        <div>
                            <Label>Source File</Label>
                            <a
                                href={activeAsset.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center"
                            >
                                {activeAsset.source.split('/').pop()}
                                <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </div>

                        <div>
                            <Label>File Size</Label>
                            <p className="text-sm text-muted-foreground">
                                {formatFileSize(activeAsset.fileSize)}
                            </p>
                        </div>

                        <div>
                            <Label>Dimensions</Label>
                            <p className="text-sm text-muted-foreground">
                                {activeAsset.width} x {activeAsset.height}
                            </p>
                        </div>

                        <div>
                            <Label>Focal Point</Label>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {activeAsset.focalPoint ? (
                                        <span className="flex items-center">
                                            <Crosshair className="mr-1 h-4 w-4" />
                                            x: {activeAsset.focalPoint.x.toFixed(2)}, y:{' '}
                                            {activeAsset.focalPoint.y.toFixed(2)}
                                        </span>
                                    ) : (
                                        'Not set'
                                    )}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        disabled={settingFocalPoint}
                                        onClick={handleFocalPointStart}
                                    >
                                        {activeAsset.focalPoint ? 'Update' : 'Set'} Focal Point
                                    </Button>
                                    {activeAsset.focalPoint && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled={settingFocalPoint}
                                            onClick={handleRemoveFocalPoint}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>Preview Options</CardHeader>
                    <CardContent className="space-y-4">
                        <Select value={size} onValueChange={value => setSize(value as PreviewPreset)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tiny">Tiny</SelectItem>
                                <SelectItem value="thumb">Thumb</SelectItem>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="full">Full Size</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            {width} x {height}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="relative flex items-center justify-center bg-muted/30 rounded-lg">
                {assets && assets.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 z-10"
                            onClick={() => setAssetIndex(i => i - 1)}
                            disabled={assetIndex === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 z-10"
                            onClick={() => setAssetIndex(i => i + 1)}
                            disabled={assetIndex === assets.length - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}

                <div
                    ref={containerRef}
                    className={cn(
                        'relative',
                        centered && 'flex items-center justify-center',
                        settingFocalPoint && 'cursor-crosshair',
                    )}
                >
                    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
                        <VendureImage
                            ref={imageRef}
                            asset={activeAsset}
                            preset={size || undefined}
                            mode="resize"
                            onLoad={updateDimensions}
                            className="max-w-full max-h-full object-contain"
                        />
                        {settingFocalPoint && lastFocalPoint && (
                            <FocalPointControl
                                width={width}
                                height={height}
                                point={lastFocalPoint}
                                onChange={handleFocalPointChange}
                            />
                        )}
                    </div>

                    {settingFocalPoint && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            <Button variant="secondary" onClick={handleFocalPointCancel}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleFocalPointSet}>
                                <Crosshair className="mr-2 h-4 w-4" />
                                Set Focal Point
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
