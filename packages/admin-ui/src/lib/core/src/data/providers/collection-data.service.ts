import { pick } from '@vendure/common/lib/pick';
import { from } from 'rxjs';
import { bufferCount, concatMap } from 'rxjs/operators';

import * as Codegen from '../../common/generated-types';
import {
    CREATE_COLLECTION,
    DELETE_COLLECTION,
    GET_COLLECTION,
    GET_COLLECTION_CONTENTS,
    GET_COLLECTION_FILTERS,
    GET_COLLECTION_LIST,
    MOVE_COLLECTION,
    UPDATE_COLLECTION,
} from '../definitions/collection-definitions';

import { BaseDataService } from './base-data.service';

export class CollectionDataService {
    constructor(private baseDataService: BaseDataService) {}

    getCollectionFilters() {
        return this.baseDataService.query<Codegen.GetCollectionFiltersQuery>(GET_COLLECTION_FILTERS);
    }

    getCollections(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<
            Codegen.GetCollectionListQuery,
            Codegen.GetCollectionListQueryVariables
        >(GET_COLLECTION_LIST, {
            options: {
                take,
                skip,
            },
        });
    }

    getCollection(id: string) {
        return this.baseDataService.query<Codegen.GetCollectionQuery, Codegen.GetCollectionQueryVariables>(
            GET_COLLECTION,
            {
                id,
            },
        );
    }

    createCollection(input: Codegen.CreateCollectionInput) {
        return this.baseDataService.mutate<
            Codegen.CreateCollectionMutation,
            Codegen.CreateCollectionMutationVariables
        >(CREATE_COLLECTION, {
            input: pick(input, [
                'translations',
                'parentId',
                'assetIds',
                'featuredAssetId',
                'filters',
                'customFields',
            ]),
        });
    }

    updateCollection(input: Codegen.UpdateCollectionInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateCollectionMutation,
            Codegen.UpdateCollectionMutationVariables
        >(UPDATE_COLLECTION, {
            input: pick(input, [
                'id',
                'isPrivate',
                'translations',
                'assetIds',
                'featuredAssetId',
                'filters',
                'customFields',
            ]),
        });
    }

    moveCollection(inputs: Codegen.MoveCollectionInput[]) {
        return from(inputs).pipe(
            concatMap(input =>
                this.baseDataService.mutate<
                    Codegen.MoveCollectionMutation,
                    Codegen.MoveCollectionMutationVariables
                >(MOVE_COLLECTION, { input }),
            ),
            bufferCount(inputs.length),
        );
    }

    deleteCollection(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeleteCollectionMutation,
            Codegen.DeleteCollectionMutationVariables
        >(DELETE_COLLECTION, {
            id,
        });
    }

    getCollectionContents(id: string, take: number = 10, skip: number = 0, filterTerm?: string) {
        const filter = filterTerm
            ? ({ name: { contains: filterTerm } } as Codegen.CollectionFilterParameter)
            : undefined;
        return this.baseDataService.query<
            Codegen.GetCollectionContentsQuery,
            Codegen.GetCollectionContentsQueryVariables
        >(GET_COLLECTION_CONTENTS, {
            id,
            options: {
                skip,
                take,
                filter,
            },
        });
    }
}
