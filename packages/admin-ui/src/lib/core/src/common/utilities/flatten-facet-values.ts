import { FacetValueFragment, FacetWithValuesFragment } from '../generated-types';

export function flattenFacetValues(facetsWithValues: FacetWithValuesFragment[]): FacetValueFragment[] {
    return facetsWithValues.reduce(
        (flattened, facet) => flattened.concat(facet.values),
        [] as FacetValueFragment[],
    );
}
