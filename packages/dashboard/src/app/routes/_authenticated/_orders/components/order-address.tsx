import { Separator } from '@/vdb/components/ui/separator.js';
import { ResultOf } from 'gql.tada';
import { Globe, Phone } from 'lucide-react';
import { orderAddressFragment } from '../orders.graphql.js';

type OrderAddress = ResultOf<typeof orderAddressFragment>;

export function OrderAddress({ address }: { address?: OrderAddress }) {
    if (!address) {
        return null;
    }

    const {
        fullName,
        company,
        streetLine1,
        streetLine2,
        city,
        province,
        postalCode,
        country,
        countryCode,
        phoneNumber,
    } = address;

    return (
        <div className="space-y-2">
            {fullName && <p className="font-medium">{fullName}</p>}
            {company && <p className="text-sm text-muted-foreground">{company}</p>}

            <div className="text-sm">
                {streetLine1 && <p>{streetLine1}</p>}
                {streetLine2 && <p>{streetLine2}</p>}
                <p>{[city, province].filter(Boolean).join(', ')}</p>
                {postalCode && <p>{postalCode}</p>}
                {country && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{country}</span>
                        {countryCode && (
                            <span className="text-xs text-muted-foreground">({countryCode})</span>
                        )}
                    </div>
                )}
            </div>

            {phoneNumber && (
                <>
                    <Separator className="my-2" />
                    <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{phoneNumber}</span>
                    </div>
                </>
            )}
        </div>
    );
}
