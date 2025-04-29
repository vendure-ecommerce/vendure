import { VendureImage } from '@/components/shared/vendure-image.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent } from '@/components/ui/card.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { Input } from '@/components/ui/input.js';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { api } from '@/graphql/api.js';
import { assetFragment, AssetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';
import { formatFileSize } from '@/lib/utils.js';
import { Trans } from '@/lib/trans.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Search, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDebounce } from '@uidotdev/usehooks';
import { DetailPageButton } from '../detail-page-button.js';

const getAssetListDocument = graphql(
    `
        query GetAssetList($options: AssetListOptions) {
            assets(options: $options) {
                items {
                    ...Asset
                }
                totalItems
            }
        }
    `,
    [assetFragment],
);

export const createAssetsDocument = graphql(
    `
        mutation CreateAssets($input: [CreateAssetInput!]!) {
            createAssets(input: $input) {
                ...Asset
                ... on Asset {
                    tags {
                        id
                        createdAt
                        updatedAt
                        value
                    }
                }
                ... on ErrorResult {
                    message
                }
            }
        }
    `,
    [assetFragment],
);

const AssetType = {
    ALL: 'ALL',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    BINARY: 'BINARY',
} as const;

export type Asset = AssetFragment;

export interface AssetGalleryProps {
    onSelect?: (assets: Asset[]) => void;
    selectable?: boolean;
    /**
     * @description
     * Defines whether multiple assets can be selected.
     * 
     * If set to 'auto', the asset selection will be toggled when the user clicks on an asset.
     * If set to 'manual', multiple selection will occur only if the user holds down the control/cmd key.
     */
    multiSelect?: 'auto' | 'manual';
    initialSelectedAssets?: Asset[];
    pageSize?: number;
    fixedHeight?: boolean;
    showHeader?: boolean;
    className?: string;
    onFilesDropped?: (files: File[]) => void;
}

export function AssetGallery({
    onSelect,
    selectable = true,
    multiSelect = undefined,
    initialSelectedAssets = [],
    pageSize = 24,
    fixedHeight = false,
    showHeader = true,
    className = '',
    onFilesDropped,
}: AssetGalleryProps) {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [assetType, setAssetType] = useState<string>(AssetType.ALL);
    const [selected, setSelected] = useState<Asset[]>(initialSelectedAssets || []);
    const queryClient = useQueryClient();

    const queryKey = ['AssetGallery', page, pageSize, debouncedSearch, assetType];

    // Query for assets
    const { data, isLoading } = useQuery({
        queryKey,
        queryFn: () => {
            const filter: Record<string, any> = {};

            if (debouncedSearch) {
                filter.name = { contains: debouncedSearch };
            }

            if (assetType !== AssetType.ALL) {
                filter.type = { eq: assetType };
            }

            return api.query(getAssetListDocument, {
                options: {
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    filter: Object.keys(filter).length > 0 ? filter : undefined,
                    sort: { createdAt: 'DESC' },
                },
            });
        },
    });

    const { mutate: createAssets } = useMutation({
        mutationFn: api.mutate(createAssetsDocument),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Setup dropzone
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            createAssets({ input: acceptedFiles.map(file => ({ file })) });
        },
        [createAssets],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

    // Calculate total pages
    const totalItems = data?.assets.totalItems || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Handle selection
    const handleSelect = (asset: Asset, event: React.MouseEvent) => {
        if (multiSelect === 'auto') {
            const isSelected = selected.some(a => a.id === asset.id);
            let newSelected: Asset[];

            if (isSelected) {
                newSelected = selected.filter(a => a.id !== asset.id);
            } else {
                newSelected = [...selected, asset];
            }

            setSelected(newSelected);
            onSelect?.(newSelected);
            return;
        }


        // Manual mode - check for modifier key
        const isModifierKeyPressed = event.metaKey || event.ctrlKey;

        if (multiSelect === 'manual' && isModifierKeyPressed) {
            // Toggle selection
            const isSelected = selected.some(a => a.id === asset.id);
            let newSelected: Asset[];

            if (isSelected) {
                newSelected = selected.filter(a => a.id !== asset.id);
            } else {
                newSelected = [...selected, asset];
            }

            setSelected(newSelected);
            onSelect?.(newSelected);
        } else {
            // No modifier key - single select
            setSelected([asset]);
            onSelect?.([asset]);
        }
    };

    // Check if an asset is selected
    const isSelected = (asset: Asset) => selected.some(a => a.id === asset.id);

    // Clear filters
    const clearFilters = () => {
        setSearch('');
        setAssetType(AssetType.ALL);
        setPage(1);
    };

    // Go to specific page
    const goToPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    // Create a function to open the file dialog
    const openFileDialog = () => {
        // This will trigger the file input's click event
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.addEventListener('change', event => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                const filesList = Array.from(target.files);
                onDrop(filesList);
            }
        });
        fileInput.click();
    };

    return (
        <div className={`flex flex-col w-full ${fixedHeight ? 'h-[600px]' : ''} ${className}`}>
            {showHeader && (
                <div className="flex flex-col md:flex-row gap-2 mb-4 flex-shrink-0">
                    <div className="relative flex-grow flex items-center gap-2">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search assets..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-8"
                        />
                        {(search || assetType !== AssetType.ALL) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="absolute right-0"
                            >
                                <X className="h-4 w-4 mr-1" /> Clear filters
                            </Button>
                        )}
                    </div>
                    <Select value={assetType} onValueChange={setAssetType}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Asset type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={AssetType.ALL}>All types</SelectItem>
                            <SelectItem value={AssetType.IMAGE}>Images</SelectItem>
                            <SelectItem value={AssetType.VIDEO}>Video</SelectItem>
                            <SelectItem value={AssetType.BINARY}>Binary</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={openFileDialog} className="whitespace-nowrap">
                        <Upload className="h-4 w-4 mr-2" /> <Trans>Upload</Trans>
                    </Button>
                </div>
            )}

            <div
                {...getRootProps()}
                className={`
                    ${fixedHeight ? 'flex-grow overflow-y-auto' : ''}
                    ${isDragActive ? 'ring-2 ring-primary bg-primary/5' : ''}
                    relative rounded-md transition-all
                `}
            >
                <input {...getInputProps()} />

                {isDragActive && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-md">
                        <Upload className="h-12 w-12 text-primary mb-2" />
                        <p className="text-center font-medium">Drop files here to upload</p>
                    </div>
                )}

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-1">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        data?.assets.items.map(asset => (
                            <Card
                                key={asset.id}
                                className={`
                                    overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/20
                                    ${isSelected(asset as Asset) ? 'ring-2 ring-primary' : ''}
                                    flex flex-col min-w-[120px]
                                `}
                                onClick={(e) => handleSelect(asset as Asset, e)}
                            >
                                <div
                                    className="relative w-full bg-muted/30"
                                    style={{
                                        aspectRatio: '1/1',
                                        minHeight: '120px', // Ensure minimum height for the image
                                    }}
                                >
                                    <VendureImage
                                        asset={asset}
                                        preset="thumb"
                                        className="w-full h-full object-contain"
                                    />
                                    {selectable && (
                                        <div className="absolute top-2 left-2">
                                            <Checkbox checked={isSelected(asset as Asset)} />
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-2">
                                    <p className="text-xs line-clamp-2 min-h-[2.5rem]" title={asset.name}>
                                        {asset.name}
                                    </p>
                                    <div className='flex justify-between items-center'>
                                        {asset.fileSize && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatFileSize(asset.fileSize)}
                                            </p>
                                        )}
                                        <DetailPageButton id={asset.id} label={<Trans>Edit</Trans>} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}

                    {!isLoading && data?.assets.items.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No assets found. Try adjusting your filters.
                        </div>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <Pagination className="mt-4 flex-shrink-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                size="default"
                                onClick={e => {
                                    e.preventDefault();
                                    goToPage(page - 1);
                                }}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        {/* First page */}
                        {page > 2 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(1);
                                    }}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Ellipsis if needed */}
                        {page > 3 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {/* Previous page */}
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(page - 1);
                                    }}
                                >
                                    {page - 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Current page */}
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                {page}
                            </PaginationLink>
                        </PaginationItem>

                        {/* Next page */}
                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(page + 1);
                                    }}
                                >
                                    {page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Ellipsis if needed */}
                        {page < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {/* Last page */}
                        {page < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(totalPages);
                                    }}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    goToPage(page + 1);
                                }}
                                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <div className="mt-2 text-xs text-muted-foreground flex-shrink-0">
                {totalItems} {totalItems === 1 ? 'asset' : 'assets'} found
                {selected.length > 0 && `, ${selected.length} selected`}
            </div>
        </div>
    );
}
