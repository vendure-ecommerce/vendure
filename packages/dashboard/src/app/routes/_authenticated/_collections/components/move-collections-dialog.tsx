import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';
import { Input } from '@/vdb/components/ui/input.js';
import { ScrollArea } from '@/vdb/components/ui/scroll-area.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { ChevronRight, Folder, FolderOpen, Search } from 'lucide-react';

import { collectionListForMoveDocument, moveCollectionDocument } from '../collections.graphql.js';

type Collection = {
    id: string;
    name: string;
    slug: string;
    children?: { id: string }[] | null;
    breadcrumbs: Array<{ id: string; name: string; slug: string }>;
    parentId?: string;
};

interface MoveCollectionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    collectionsToMove: Collection[];
    onSuccess?: () => void;
}

interface CollectionTreeNodeProps {
    collection: Collection;
    depth: number;
    expanded: Record<string, boolean>;
    onToggleExpanded: (id: string) => void;
    onSelect: (collection: Collection) => void;
    selectedCollectionId?: string;
    collectionsToMove: Collection[];
    childCollectionsByParentId: Record<string, Collection[]>;
}

interface TargetAlertProps {
    selectedCollectionId?: string;
    collectionsToMove: Collection[];
    topLevelCollectionId?: string;
    collectionNameCache: React.MutableRefObject<Map<string, string>>;
}

interface MoveToTopLevelProps {
    selectedCollectionId?: string;
    topLevelCollectionId?: string;
    onSelect: (id?: string) => void;
}

function TargetAlert({
    selectedCollectionId,
    collectionsToMove,
    topLevelCollectionId,
    collectionNameCache,
}: Readonly<TargetAlertProps>) {
    return (
        <Alert className={selectedCollectionId ? 'border-blue-200 bg-blue-50' : ''}>
            <Folder className="h-4 w-4" />
            <AlertDescription>
                {selectedCollectionId ? (
                    <Trans>
                        Moving {collectionsToMove.length} collection
                        {collectionsToMove.length === 1 ? '' : 's'} into{' '}
                        {selectedCollectionId === topLevelCollectionId
                            ? 'top level'
                            : collectionNameCache.current.get(selectedCollectionId) || 'selected collection'}
                    </Trans>
                ) : (
                    <Trans>Select a destination collection</Trans>
                )}
            </AlertDescription>
        </Alert>
    );
}

function MoveToTopLevel({
    selectedCollectionId,
    topLevelCollectionId,
    onSelect,
}: Readonly<MoveToTopLevelProps>) {
    return (
        <button
            type="button"
            className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded-sm cursor-pointer w-full text-left ${
                selectedCollectionId === topLevelCollectionId ? 'bg-accent' : ''
            }`}
            onClick={() => onSelect(topLevelCollectionId)}
        >
            <div className="w-3 h-3" />
            <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                    <Trans>Move to the top level</Trans>
                </span>
            </div>
        </button>
    );
}

function CollectionTreeNode({
    collection,
    depth,
    expanded,
    onToggleExpanded,
    onSelect,
    selectedCollectionId,
    collectionsToMove,
    childCollectionsByParentId,
}: Readonly<CollectionTreeNodeProps>) {
    const hasChildren = collection.children && collection.children.length > 0;
    const isExpanded = expanded[collection.id];
    const isSelected = selectedCollectionId === collection.id;
    const isBeingMoved = collectionsToMove.some(c => c.id === collection.id);
    const isChildOfBeingMoved = collectionsToMove.some(c => collection.breadcrumbs.some(b => b.id === c.id));

    // Don't allow selecting collections that are being moved or are children of collections being moved
    const isSelectable = !isBeingMoved && !isChildOfBeingMoved;

    const childCollections = childCollectionsByParentId[collection.id] || [];

    return (
        <div className="my-0.5">
            <div className="flex items-center" style={{ marginLeft: depth * 20 }}>
                {hasChildren && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-4 w-4 p-0 mr-1"
                        onClick={() => onToggleExpanded(collection.id)}
                    >
                        {isExpanded ? (
                            <ChevronRight className="h-3 w-3 rotate-90" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                    </Button>
                )}
                {!hasChildren && <div className="w-5 h-4 mr-1" />}
                <button
                    type="button"
                    className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded-sm cursor-pointer w-full text-left ${
                        isSelected ? 'bg-accent' : ''
                    } ${!isSelectable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                        if (isSelectable) {
                            onSelect(collection);
                        }
                    }}
                    disabled={!isSelectable}
                >
                    <div className="flex items-center gap-2">
                        {hasChildren &&
                            (isExpanded ? (
                                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Folder className="h-4 w-4 text-muted-foreground" />
                            ))}
                        {!hasChildren && <div className="w-4 h-4" />}
                        <div className="flex flex-col">
                            <span className="text-sm">{collection.name}</span>
                            {collection.breadcrumbs.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                    {collection.breadcrumbs
                                        .slice(1)
                                        .map(b => b.name)
                                        .join(' / ')}
                                </span>
                            )}
                        </div>
                    </div>
                </button>
            </div>
            {hasChildren && isExpanded && (
                <div>
                    {childCollections.map((childCollection: Collection) => (
                        <CollectionTreeNode
                            key={childCollection.id}
                            collection={childCollection}
                            depth={depth + 1}
                            expanded={expanded}
                            onToggleExpanded={onToggleExpanded}
                            onSelect={onSelect}
                            selectedCollectionId={selectedCollectionId}
                            collectionsToMove={collectionsToMove}
                            childCollectionsByParentId={childCollectionsByParentId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function MoveCollectionsDialog({
    open,
    onOpenChange,
    collectionsToMove,
    onSuccess,
}: Readonly<MoveCollectionsDialogProps>) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const collectionNameCache = useRef<Map<string, string>>(new Map());
    const queryClient = useQueryClient();
    const { i18n } = useLingui();
    const collectionForMoveKey = ['collectionsForMove', debouncedSearchTerm];
    const childCollectionsForMoveKey = (collectionId?: string) =>
        collectionId ? ['childCollectionsForMove', collectionId] : ['childCollectionsForMove'];

    const { data: collectionsData, isLoading } = useQuery({
        queryKey: collectionForMoveKey,
        queryFn: () =>
            api.query(collectionListForMoveDocument, {
                options: {
                    take: 100,
                    topLevelOnly: !debouncedSearchTerm,
                    ...(debouncedSearchTerm && {
                        filter: {
                            name: { contains: debouncedSearchTerm },
                        },
                    }),
                },
            }),
        staleTime: 1000 * 60 * 5,
        enabled: open,
    });

    const topLevelCollectionId = collectionsData?.collections.items[0]?.parentId;
    const selectionHasTopLevelParent = collectionsToMove.some(c => c.parentId === topLevelCollectionId);

    // Load child collections for expanded nodes
    const childrenQueries = useQueries({
        queries: Object.entries(expanded).map(([collectionId, isExpanded]) => {
            return {
                queryKey: childCollectionsForMoveKey(collectionId),
                queryFn: () =>
                    api.query(collectionListForMoveDocument, {
                        options: {
                            filter: {
                                parentId: { eq: collectionId },
                            },
                        },
                    }),
                staleTime: 1000 * 60 * 5,
            };
        }),
    });

    const childCollectionsByParentId = childrenQueries.reduce(
        (acc, query, index) => {
            const collectionId = Object.keys(expanded)[index];
            if (query.data) {
                const collections = query.data.collections.items as Collection[];
                // Populate the name cache with these collections
                collections.forEach(collection => {
                    collectionNameCache.current.set(collection.id, collection.name);
                });
                acc[collectionId] = collections;
            }
            return acc;
        },
        {} as Record<string, Collection[]>,
    );

    const moveCollectionsMutation = useMutation({
        mutationFn: api.mutate(moveCollectionDocument),
        onSuccess: () => {
            toast.success(i18n.t('Collections moved successfully'));
            queryClient.invalidateQueries({ queryKey: collectionForMoveKey });
            queryClient.invalidateQueries({ queryKey: childCollectionsForMoveKey() });
            onSuccess?.();
            onOpenChange(false);
        },
        onError: error => {
            toast.error(i18n.t('Failed to move collections'));
            console.error('Move collections error:', error);
        },
    });

    const handleToggleExpanded = (id: string) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSelect = (collection: Collection) => {
        setSelectedCollectionId(collection.id);
    };

    const handleMove = () => {
        if (!selectedCollectionId) {
            toast.error(i18n.t('Please select a target collection'));
            return;
        }
        // Move to a specific parent using moveCollection
        const movePromises = collectionsToMove.map((collection: Collection) =>
            moveCollectionsMutation.mutateAsync({
                input: {
                    collectionId: collection.id,
                    parentId: selectedCollectionId,
                    index: 0, // Move to the beginning of the target collection
                },
            }),
        );
        Promise.all(movePromises);
    };

    const collections = (collectionsData?.collections.items as Collection[]) || [];

    // Populate the name cache with top-level collections
    collections.forEach(collection => {
        collectionNameCache.current.set(collection.id, collection.name);
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Move Collections</Trans>
                    </DialogTitle>
                    <DialogDescription>
                        <Trans>
                            Select a target collection to move{' '}
                            {collectionsToMove.length === 1
                                ? 'this collection'
                                : `${collectionsToMove.length} collections`}{' '}
                            to.
                        </Trans>
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6 py-3 bg-muted/50 border-b">
                    <div className="flex flex-wrap gap-2">
                        {collectionsToMove.map(collection => (
                            <div
                                key={collection.id}
                                className="flex items-center gap-2 px-3 py-1 bg-background border rounded-md text-sm"
                            >
                                <Folder className="h-3 w-3 text-muted-foreground" />
                                <span>{collection.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="py-4">
                    <div className="px-6 pb-3">
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={i18n.t('Filter by collection name')}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-1">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Trans>Loading collections...</Trans>
                                    </div>
                                ) : (
                                    <>
                                        {!debouncedSearchTerm && !selectionHasTopLevelParent && (
                                            <MoveToTopLevel
                                                selectedCollectionId={selectedCollectionId}
                                                topLevelCollectionId={topLevelCollectionId}
                                                onSelect={setSelectedCollectionId}
                                            />
                                        )}
                                        {collections.map((collection: Collection) => (
                                            <CollectionTreeNode
                                                key={collection.id}
                                                collection={collection}
                                                depth={0}
                                                expanded={expanded}
                                                onToggleExpanded={handleToggleExpanded}
                                                onSelect={handleSelect}
                                                selectedCollectionId={selectedCollectionId}
                                                collectionsToMove={collectionsToMove}
                                                childCollectionsByParentId={childCollectionsByParentId}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                        <TargetAlert
                            selectedCollectionId={selectedCollectionId}
                            collectionsToMove={collectionsToMove}
                            topLevelCollectionId={topLevelCollectionId}
                            collectionNameCache={collectionNameCache}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <Trans>Cancel</Trans>
                    </Button>
                    <Button
                        onClick={handleMove}
                        disabled={!selectedCollectionId || moveCollectionsMutation.isPending}
                    >
                        {moveCollectionsMutation.isPending ? (
                            <Trans>Moving...</Trans>
                        ) : (
                            <Trans>Move Collections</Trans>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
