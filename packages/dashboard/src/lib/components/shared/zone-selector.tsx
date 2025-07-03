import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/vdb/components/ui/select.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '../ui/skeleton.js';

const zonesDocument = graphql(`
    query Zones($options: ZoneListOptions) {
        zones(options: $options) {
            items {
                id
                name
            }
        }
    }
`);

export interface ZoneSelectorProps {
    value: string | undefined;
    onChange: (value: string) => void;
}

export function ZoneSelector({ value, onChange }: Readonly<ZoneSelectorProps>) {
    const { data, isLoading, isPending } = useQuery({
        queryKey: ['zones'],
        staleTime: 1000 * 60 * 5,
        queryFn: () =>
            api.query(zonesDocument, {
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
                <SelectValue placeholder={<Trans>Select a zone</Trans>} />
            </SelectTrigger>
            <SelectContent>
                {data && (
                    <SelectGroup>
                        {data?.zones.items.map(zone => (
                            <SelectItem key={zone.id} value={zone.id}>
                                {zone.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                )}
            </SelectContent>
        </Select>
    );
}
