import { collectionDuplicator } from './collection-duplicator';
import { facetDuplicator } from './facet-duplicator';
import { productDuplicator } from './product-duplicator';

export const defaultEntityDuplicators = [productDuplicator, collectionDuplicator, facetDuplicator];
