import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.js';
import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { Trans } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '../ui/skeleton.js';

const taxCategoriesDocument = graphql(`
    query TaxCategories($options: TaxCategoryListOptions) {
        taxCategories(options: $options) {
            items {
                id
                name
                isDefault
            }
        }
    }
`);

export interface TaxCategorySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function TaxCategorySelector({ value, onChange }: TaxCategorySelectorProps) {
    const { data, isLoading, isPending, status } = useQuery({
        queryKey: ['taxCategories'],
        staleTime: 1000 * 60 * 5,
        queryFn: () =>
            api.query(taxCategoriesDocument, {
                options: {
                    take: 100,
                },
            }),
    });
    if (isLoading || isPending) {
        return <Skeleton className="h-10 w-full" />;
    }

    return (
        <Select value={value} onValueChange={value => value && onChange(value)}>
            <SelectTrigger>
                <SelectValue placeholder={<Trans>Select a tax category</Trans>} />
            </SelectTrigger>
            <SelectContent>
                {data && (
                    <SelectGroup>
                        {data?.taxCategories.items.map(taxCategory => (
                            <SelectItem key={taxCategory.id} value={taxCategory.id}>
                                {taxCategory.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                )}
            </SelectContent>
        </Select>
    );
}
