import { ResultOf } from 'gql.tada';
import { useState } from 'react';

import { collectionListDocument } from '../collections.graphql.js';
import { MoveCollectionsDialog } from './move-collections-dialog.js';

type Collection = ResultOf<typeof collectionListDocument>['collections']['items'][number];

export function useMoveSingleCollection() {
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [collectionsToMove, setCollectionsToMove] = useState<Collection[]>([]);

    const handleMoveClick = (collection: Collection) => {
        setCollectionsToMove([collection]);
        setMoveDialogOpen(true);
    };

    const MoveDialog = () => (
        <MoveCollectionsDialog
            open={moveDialogOpen}
            onOpenChange={setMoveDialogOpen}
            collectionsToMove={collectionsToMove}
            onSuccess={() => {
                // The dialog will handle invalidating queries internally
            }}
        />
    );

    return {
        handleMoveClick,
        MoveDialog,
    };
}
