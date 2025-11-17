import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { useServerConfig } from '@/vdb/hooks/use-server-config.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { cn } from '@/vdb/lib/utils.js';
import { useMemo } from 'react';

interface ContentLanguageSelectorProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export function ContentLanguageSelector({ value, onChange, className }: ContentLanguageSelectorProps) {
    const serverConfig = useServerConfig();
    const { formatLanguageName } = useLocalFormat();
    const {
        settings: { contentLanguage },
        setContentLanguage,
    } = useUserSettings();

    // Map languages to code and label, then sort by label

    const sortedLanguages = useMemo(
        () =>
            (serverConfig?.availableLanguages || [])
                .map(code => ({
                    code,
                    label: formatLanguageName(code),
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [serverConfig?.availableLanguages, formatLanguageName],
    );

    // If no value is provided but languages are available, use the first language
    const currentValue = contentLanguage;

    return (
        <Select
            value={currentValue}
            onValueChange={value => {
                onChange?.(value);
                setContentLanguage(value);
            }}
        >
            <SelectTrigger className={cn('w-[200px]', className)}>
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {sortedLanguages.map(({ code, label }) => (
                    <SelectItem key={code} value={code}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
