import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { MultiSelect } from './multi-select.js';

const availableGlobalLanguages = graphql(`
    query AvailableGlobalLanguages {
        globalSettings {
            availableLanguages
        }
    }
`);

export interface LanguageSelectorProps<T extends boolean> {
    value: T extends true ? string[] : string;
    onChange: (value: T extends true ? string[] : string) => void;
    multiple?: T;
    availableLanguageCodes?: string[];
}

export function LanguageSelector<T extends boolean>(props: LanguageSelectorProps<T>) {
    const { data } = useQuery({
        queryKey: ['availableGlobalLanguages'],
        queryFn: () => api.query(availableGlobalLanguages),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const { formatLanguageName } = useLocalFormat();
    const { value, onChange, multiple, availableLanguageCodes } = props;
    const { i18n } = useLingui();

    const items = (availableLanguageCodes ?? data?.globalSettings.availableLanguages ?? []).map(language => ({
        value: language,
        label: formatLanguageName(language),
    }));

    return (
        <MultiSelect
            value={value}
            onChange={onChange}
            multiple={multiple}
            items={items}
            placeholder={i18n.t('Select a language')}
            searchPlaceholder={i18n.t('Search languages...')}
        />
    );
}
