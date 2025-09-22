import { DashboardFormComponent } from '@/vdb/framework/form-engine/form-engine-types.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { FacetValueChip } from '../shared/facet-value-chip.js';
import { FacetValue, FacetValueSelector } from '../shared/facet-value-selector.js';

const facetValuesDocument = graphql(`
    query FacetValues($options: FacetValueListOptions) {
        facetValues(options: $options) {
            items {
                id
                name
                code
                facet {
                    id
                    name
                    code
                }
            }
        }
    }
`);

export const FacetValueInput: DashboardFormComponent = ({ value, onChange, disabled }) => {
    const ids = decodeIds(value);
    const { data } = useQuery({
        queryKey: ['facetValues', ids],
        queryFn: () =>
            api.query(facetValuesDocument, {
                options: {
                    filter: {
                        id: { in: ids },
                    },
                },
            }),
    });

    const onValueSelectHandler = (value: FacetValue) => {
        const newIds = new Set([...ids, value.id]);
        onChange(JSON.stringify(Array.from(newIds)));
    };

    const onValueRemoveHandler = (id: string) => {
        const newIds = new Set(ids.filter(existingId => existingId !== id));
        onChange(JSON.stringify(Array.from(newIds)));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {data?.facetValues.items.map(item => (
                    <FacetValueChip
                        key={item.id}
                        facetValue={item}
                        onRemove={() => onValueRemoveHandler(item.id)}
                    />
                ))}
            </div>
            <FacetValueSelector onValueSelect={onValueSelectHandler} disabled={disabled} />
        </div>
    );
};

FacetValueInput.metadata = {
    isListInput: true,
};

function decodeIds(idsString: string | string[]): string[] {
    if (Array.isArray(idsString)) {
        return idsString;
    }
    try {
        return JSON.parse(idsString);
    } catch (error) {
        return [];
    }
}
