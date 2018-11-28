import { FacetValue, FacetWithValues } from 'shared/generated-types';

export function flattenFacetValues(facetsWithValues: FacetWithValues.Fragment[]): FacetValue.Fragment[] {
    return facetsWithValues.reduce(
        (flattened, facet) => flattened.concat(facet.values),
        [] as FacetValue.Fragment[],
    );
}
