import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { ChannelCodeLabel } from './channel-code-label.js';
import { MultiSelect } from './multi-select.js';

const channelsDocument = graphql(`
    query channels($options: ChannelListOptions) {
        channels(options: $options) {
            items {
                id
                code
            }
        }
    }
`);

export interface ChannelSelectorProps<T extends boolean> {
    value: T extends true ? string[] : string;
    onChange: (value: T extends true ? string[] : string) => void;
    multiple?: T;
}

export function ChannelSelector<T extends boolean>(props: ChannelSelectorProps<T>) {
    const { value, onChange, multiple } = props;
    const { i18n } = useLingui();

    const { data: channelsData } = useQuery({
        queryKey: ['channels'],
        queryFn: () => api.query(channelsDocument, {}),
        staleTime: 1000 * 60 * 5,
    });

    const items = (channelsData?.channels.items ?? []).map(channel => ({
        value: channel.id,
        label: channel.code,
        display: <ChannelCodeLabel code={channel.code} />,
    }));

    return (
        <MultiSelect
            value={value}
            onChange={onChange}
            multiple={multiple}
            items={items}
            placeholder={i18n.t('Select a channel')}
            searchPlaceholder={i18n.t('Search channels...')}
        />
    );
}
