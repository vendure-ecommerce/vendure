import { pick } from '@vendure/common/lib/pick';
import { from } from 'rxjs';
import { bufferCount, concatMap } from 'rxjs/operators';

import {
    AssignCollectionsToChannelInput,
    AssignCollectionsToChannelMutation,
    AssignCollectionsToChannelMutationVariables,
    CollectionFilterParameter,
    CreateCollection,
    CreateCollectionInput,
    DeleteCollection,
    DeleteCollectionsMutation,
    DeleteCollectionsMutationVariables,
    GetCollection,
    GetCollectionContents,
    GetCollectionFilters,
    GetCollectionList,
    MoveCollection,
    MoveCollectionInput,
    PreviewCollectionContentsQuery,
    PreviewCollectionContentsQueryVariables,
    PreviewCollectionVariantsInput,
    ProductVariantListOptions,
    RemoveCollectionsFromChannelInput,
    RemoveCollectionsFromChannelMutation,
    RemoveCollectionsFromChannelMutationVariables,
    UpdateCollection,
    UpdateCollectionInput,
} from '../../common/generated-types';
import {
    ASSIGN_COLLECTIONS_TO_CHANNEL,
    CREATE_COLLECTION,
    DELETE_COLLECTION,
    DELETE_COLLECTIONS,
    GET_COLLECTION,
    GET_COLLECTION_CONTENTS,
    GET_COLLECTION_FILTERS,
    GET_COLLECTION_LIST,
    MOVE_COLLECTION,
    PREVIEW_COLLECTION_CONTENTS,
    REMOVE_COLLECTIONS_FROM_CHANNEL,
    UPDATE_COLLECTION,
} from '../definitions/collection-definitions';

import { BaseDataService } from './base-data.service';

export class CollectionDataService {
    constructor(private baseDataService: BaseDataService) {}

    getCollectionFilters() {
        return this.baseDataService.query<GetCollectionFilters.Query>(GET_COLLECTION_FILTERS);
    }

    getCollections(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetCollectionList.Query, GetCollectionList.Variables>(
            GET_COLLECTION_LIST,
            {
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getCollection(id: string) {
        return this.baseDataService.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
            id,
        });
    }

    createCollection(input: CreateCollectionInput) {
        return this.baseDataService.mutate<CreateCollection.Mutation, CreateCollection.Variables>(
            CREATE_COLLECTION,
            {
                input: pick(input, [
                    'translations',
                    'parentId',
                    'assetIds',
                    'featuredAssetId',
                    'filters',
                    'customFields',
                ]),
            },
        );
    }

    updateCollection(input: UpdateCollectionInput) {
        return this.baseDataService.mutate<UpdateCollection.Mutation, UpdateCollection.Variables>(
            UPDATE_COLLECTION,
            {
                input: pick(input, [
                    'id',
                    'isPrivate',
                    'translations',
                    'assetIds',
                    'featuredAssetId',
                    'filters',
                    'customFields',
                ]),
            },
        );
    }

    moveCollection(inputs: MoveCollectionInput[]) {
        return from(inputs).pipe(
            concatMap(input =>
                this.baseDataService.mutate<MoveCollection.Mutation, MoveCollection.Variables>(
                    MOVE_COLLECTION,
                    { input },
                ),
            ),
            bufferCount(inputs.length),
        );
    }

    deleteCollection(id: string) {
        return this.baseDataService.mutate<DeleteCollection.Mutation, DeleteCollection.Variables>(
            DELETE_COLLECTION,
            {
                id,
            },
        );
    }

    deleteCollections(ids: string[]) {
        return this.baseDataService.mutate<DeleteCollectionsMutation, DeleteCollectionsMutationVariables>(
            DELETE_COLLECTIONS,
            {
                ids,
            },
        );
    }

    previewCollectionVariants(input: PreviewCollectionVariantsInput, options: ProductVariantListOptions) {
        return this.baseDataService.query<
            PreviewCollectionContentsQuery,
            PreviewCollectionContentsQueryVariables
        >(PREVIEW_COLLECTION_CONTENTS, { input, options });
    }

    getCollectionContents(id: string, take: number = 10, skip: number = 0, filterTerm?: string) {
        const filter = filterTerm
            ? ({ name: { contains: filterTerm } } as CollectionFilterParameter)
            : undefined;
        return this.baseDataService.query<GetCollectionContents.Query, GetCollectionContents.Variables>(
            GET_COLLECTION_CONTENTS,
            {
                id,
                options: {
                    skip,
                    take,
                    filter,
                },
            },
        );
    }

    assignCollectionsToChannel(input: AssignCollectionsToChannelInput) {
        return this.baseDataService.mutate<
            AssignCollectionsToChannelMutation,
            AssignCollectionsToChannelMutationVariables
        >(ASSIGN_COLLECTIONS_TO_CHANNEL, {
            input,
        });
    }

    removeCollectionsFromChannel(input: RemoveCollectionsFromChannelInput) {
        return this.baseDataService.mutate<
            RemoveCollectionsFromChannelMutation,
            RemoveCollectionsFromChannelMutationVariables
        >(REMOVE_COLLECTIONS_FROM_CHANNEL, {
            input,
        });
    }
}
