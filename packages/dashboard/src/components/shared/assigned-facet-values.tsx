import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge.js';
import { Trans } from '@lingui/react/macro';
import { useState } from 'react';

// Interface for facet value type
interface FacetValue {
    id: string;
    name: string;
    code: string;
    facet: {
        id: string;
        name: string;
        code: string;
    };
}

interface FacetValueChipProps {
    facetValue: FacetValue;
    removable?: boolean;
    onRemove?: (id: string) => void;
}

// Individual facet value chip component
function FacetValueChip({ facetValue, removable = true, onRemove }: FacetValueChipProps) {
    const fullText = `${facetValue.facet.name}: ${facetValue.name}`;

    return (
        <Badge variant="outline" className="mr-2 mb-2 flex items-center gap-1">
            <span className="max-w-[200px] truncate" title={fullText}>
                {fullText}
            </span>
            {removable && (
                <button
                    type="button"
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/20"
                    onClick={() => onRemove?.(facetValue.id)}
                    aria-label={`Remove ${facetValue.facet.name}: ${facetValue.name}`}
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </Badge>
    );
}

interface AssignedFacetValuesProps {
    facetValues: FacetValue[];
    value: id[];
    canUpdate?: boolean;
    onBlur?: () => void;
    onChange?: (value: FacetValue[]) => void;
}

export function AssignedFacetValues({
    value = [],
    facetValues,
    canUpdate = true,
    onBlur,
    onChange,
}: AssignedFacetValuesProps) {
    function onRemoveHandler(id: string) {
        onChange?.(value.filter(fvId => fvId !== id));
    }

    function onAddHandler(id: string) {
        // onChange?.([...value, id]);
    }

    return (
        <>
            <div className="flex flex-wrap">
                {value.map(id => {
                    const facetValue = facetValues.find(fv => fv.id === id);
                    if (!facetValue) return null;
                    return (
                        <FacetValueChip
                            key={facetValue.id}
                            facetValue={facetValue}
                            removable={canUpdate}
                            onRemove={onRemoveHandler}
                        />
                    );
                })}
            </div>
            {canUpdate && (
                <div>
                    <Button variant="outline" size="sm" className="mt-2" onClick={onAddHandler}>
                        <Plus className="h-4 w-4 mr-1" />
                        <Trans>Add facets</Trans>
                    </Button>
                </div>
            )}
        </>
    );
}
