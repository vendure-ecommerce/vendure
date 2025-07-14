import { Separator } from '@/vdb/components/ui/separator.js';
import { ResultOf } from 'gql.tada';
import { Globe, Phone } from 'lucide-react';
import { orderAddressFragment } from '../orders.graphql.js';
import { Trans } from '@/vdb/lib/trans.js';

type OrderAddress = Omit<ResultOf<typeof orderAddressFragment>, 'country'> & {
    country: string | { code: string; name: string } | null;
};

export function OrderAddress({ address }: Readonly<{ address?: OrderAddress }>) {

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

    const countryName = typeof country === 'string' ? country : country?.name;
    const countryCodeString = country && typeof country !== 'string' ? country?.code : countryCode;

    if (!address || Object.values(address).every(value => !value)) {
        return <div className="text-sm text-muted-foreground"><Trans>No address</Trans></div>;
    }

    return (
        <div className="space-y-1 text-sm">
            {fullName && <p className="font-medium">{fullName}</p>}
            {company && <p className="text-sm text-muted-foreground">{company}</p>}

            <div>
                {streetLine1 && <p>{streetLine1}</p>}
                {streetLine2 && <p>{streetLine2}</p>}
                <p>{[city, province].filter(Boolean).join(', ')}</p>
                {postalCode && <p>{postalCode}</p>}
                {country && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{countryName}</span>
                        {countryCodeString && (
                            <span className="text-xs text-muted-foreground">({countryCodeString})</span>
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
