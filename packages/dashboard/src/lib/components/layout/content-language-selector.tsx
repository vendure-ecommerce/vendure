import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { useServerConfig } from '@/hooks/use-server-config.js';
import { useUserSettings } from '@/hooks/use-user-settings.js';
import { cn } from '@/lib/utils.js';

interface ContentLanguageSelectorProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export function ContentLanguageSelector({ value, onChange, className }: ContentLanguageSelectorProps) {
    const serverConfig = useServerConfig();
    const { formatLanguageName } = useLocalFormat();
    const { settings: { contentLanguage, displayLanguage }, setContentLanguage} = useUserSettings();

    // Fallback to empty array if serverConfig is null
    const languages = serverConfig?.availableLanguages || [];

    // If no value is provided but languages are available, use the first language
    const currentValue = contentLanguage;

    return (
        <Select value={currentValue} onValueChange={value => {
            onChange?.(value);
            setContentLanguage(value);
            }}>
            <SelectTrigger className={cn('w-[200px]', className)}>
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map(language => (
                    <SelectItem key={language} value={language}>
                        {formatLanguageName(language)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
