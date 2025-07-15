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

export interface FacetValueInputProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

export function FacetValueInput(props: FacetValueInputProps) {
    const ids = decodeIds(props.value);
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
        props.onChange(JSON.stringify(Array.from(newIds)));
    };

    const onValueRemoveHandler = (id: string) => {
        const newIds = new Set(ids.filter(existingId => existingId !== id));
        props.onChange(JSON.stringify(Array.from(newIds)));
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
            <FacetValueSelector onValueSelect={onValueSelectHandler} disabled={props.readOnly} />
        </div>
    );
}

function decodeIds(idsString: string): string[] {
    try {
        return JSON.parse(idsString);
    } catch (error) {
        return [];
    }
}
