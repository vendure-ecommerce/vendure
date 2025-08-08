import { CommandItem } from '@/vdb/components/ui/command.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { SearchResult, SearchResultType } from '@/vdb/providers/search-provider.js';
import * as Icons from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface SearchResultItemProps {
    result: SearchResult;
    onSelect: () => void;
}

export function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
    const navigate = useNavigate();
    const IconComponent = getIconForResultType(result.type);

    const handleSelect = () => {
        onSelect();
        
        // Handle different URL types
        if (result.url.startsWith('http')) {
            // External URL - open in new tab
            window.open(result.url, '_blank');
        } else {
            // Internal URL - navigate within the app
            navigate({ to: result.url });
        }
    };

    return (
        <CommandItem 
            key={result.id}
            value={`${result.id}-${result.title}-${result.subtitle || ''}`}
            onSelect={handleSelect}
            className="flex items-center gap-3 p-3"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/50">
                {result.thumbnailUrl ? (
                    <img 
                        src={result.thumbnailUrl} 
                        alt={result.title}
                        className="h-8 w-8 rounded-md object-cover"
                    />
                ) : (
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                )}
            </div>
            
            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{result.title}</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                        {formatResultType(result.type)}
                    </Badge>
                </div>
                
                {result.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                    </p>
                )}
                
                {result.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {result.description}
                    </p>
                )}
            </div>

            {result.url.startsWith('http') && (
                <Icons.ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
        </CommandItem>
    );
}

function getIconForResultType(type: SearchResultType): React.ComponentType<any> {
    const iconMap: Record<SearchResultType, React.ComponentType<any>> = {
        [SearchResultType.PRODUCT]: Icons.Package,
        [SearchResultType.PRODUCT_VARIANT]: Icons.Package2,
        [SearchResultType.CUSTOMER]: Icons.User,
        [SearchResultType.ORDER]: Icons.ShoppingCart,
        [SearchResultType.COLLECTION]: Icons.FolderOpen,
        [SearchResultType.ADMINISTRATOR]: Icons.UserCog,
        [SearchResultType.CHANNEL]: Icons.Globe,
        [SearchResultType.ASSET]: Icons.Image,
        [SearchResultType.FACET]: Icons.Tag,
        [SearchResultType.FACET_VALUE]: Icons.Tags,
        [SearchResultType.PROMOTION]: Icons.Percent,
        [SearchResultType.PAYMENT_METHOD]: Icons.CreditCard,
        [SearchResultType.SHIPPING_METHOD]: Icons.Truck,
        [SearchResultType.TAX_CATEGORY]: Icons.Receipt,
        [SearchResultType.TAX_RATE]: Icons.Calculator,
        [SearchResultType.COUNTRY]: Icons.Flag,
        [SearchResultType.ZONE]: Icons.MapPin,
        [SearchResultType.ROLE]: Icons.Shield,
        [SearchResultType.CUSTOMER_GROUP]: Icons.Users,
        [SearchResultType.STOCK_LOCATION]: Icons.Warehouse,
        [SearchResultType.TAG]: Icons.Hash,
        [SearchResultType.CUSTOM_ENTITY]: Icons.Box,
        [SearchResultType.NAVIGATION]: Icons.Navigation,
        [SearchResultType.SETTINGS]: Icons.Settings,
        [SearchResultType.QUICK_ACTION]: Icons.Zap,
        [SearchResultType.DOCUMENTATION]: Icons.BookOpen,
        [SearchResultType.BLOG_POST]: Icons.FileText,
        [SearchResultType.PLUGIN]: Icons.Puzzle,
        [SearchResultType.WEBSITE_CONTENT]: Icons.Globe2,
    };

    return iconMap[type] || Icons.FileText;
}

function formatResultType(type: SearchResultType): string {
    return type
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
}