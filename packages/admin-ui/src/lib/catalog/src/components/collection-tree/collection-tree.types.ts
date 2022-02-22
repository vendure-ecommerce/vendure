import { Collection } from '@vendure/admin-ui/core';

export type RearrangeEvent = { collectionId: string; parentId: string; index: number };
export type CollectionPartial = Pick<Collection.Fragment, 'id' | 'parent' | 'name'>;
