import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Collection, ProductWithVariants } from '../../../common/generated-types';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class CollectionResolver extends BaseEntityResolver<Collection.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Collection' as 'Collection',
                id: '',
                createdAt: '',
                updatedAt: '',
                languageCode: getDefaultLanguage(),
                name: '',
                isPrivate: false,
                description: '',
                featuredAsset: null,
                assets: [],
                translations: [],
                filters: [],
                parent: {} as any,
                children: null,
            },
            id => this.dataService.collection.getCollection(id).mapStream(data => data.collection),
        );
    }
}
