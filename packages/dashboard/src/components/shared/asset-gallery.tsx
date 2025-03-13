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
import { VendureImage } from '@/components/shared/vendure-image.js';
import { api } from '@/graphql/api.js';
import { AssetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';
import { formatFileSize } from '@/lib/utils.js';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

const getAssetListDocument = graphql(`
    query GetAssetList($options: AssetListOptions) {
        assets(options: $options) {
            items {
                id
                name
                preview
                fileSize
                mimeType
                type
                source
                focalPoint {
                    x
                    y
                }
            }
            totalItems
        }
    }
`);

const AssetType = {
    ALL: 'ALL',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    BINARY: 'BINARY',
} as const;

export type Asset = AssetFragment;

export interface AssetGalleryProps {
    onSelect: (assets: Asset[]) => void;
    multiSelect?: boolean;
    initialSelectedAssets?: Asset[];
    pageSize?: number;
    fixedHeight?: boolean;
    showHeader?: boolean;
    className?: string;
}

export function AssetGallery({
    onSelect,
    multiSelect = false,
    initialSelectedAssets = [],
    pageSize = 24,
    fixedHeight = false,
    showHeader = true,
    className = '',
}: AssetGalleryProps) {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [assetType, setAssetType] = useState<string>(AssetType.ALL);
    const [selected, setSelected] = useState<Asset[]>(initialSelectedAssets || []);

    // Query for assets
    const { data, isLoading } = useQuery({
        queryKey: ['AssetGallery', page, pageSize, debouncedSearch, assetType],
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

    // Calculate total pages
    const totalItems = data?.assets.totalItems || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Handle selection
    const handleSelect = (asset: Asset) => {
        if (!multiSelect) {
            setSelected([asset]);
            onSelect([asset]);
            return;
        }

        const isSelected = selected.some(a => a.id === asset.id);
        let newSelected: Asset[];

        if (isSelected) {
            newSelected = selected.filter(a => a.id !== asset.id);
        } else {
            newSelected = [...selected, asset];
        }

        setSelected(newSelected);
        onSelect(newSelected);
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

    return (
        <div className={`flex flex-col ${fixedHeight ? 'h-[600px]' : ''} ${className}`}>
            {showHeader && (
                <div className="flex flex-col md:flex-row gap-2 mb-4 flex-shrink-0">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search assets..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-8"
                        />
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
                    {(search || assetType) && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="flex-shrink-0">
                            <X className="h-4 w-4 mr-1" /> Clear filters
                        </Button>
                    )}
                </div>
            )}

            <div className={`${fixedHeight ? 'flex-grow overflow-y-auto' : ''}`}>
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
                                onClick={() => handleSelect(asset as Asset)}
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
                                    <div className="absolute top-2 left-2">
                                        <Checkbox checked={isSelected(asset as Asset)} />
                                    </div>
                                </div>
                                <CardContent className="p-2">
                                    <p className="text-xs line-clamp-2 min-h-[2.5rem]" title={asset.name}>
                                        {asset.name}
                                    </p>
                                    {asset.fileSize && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatFileSize(asset.fileSize)}
                                        </p>
                                    )}
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
