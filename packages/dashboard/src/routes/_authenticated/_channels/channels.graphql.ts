import { graphql } from '@/graphql/graphql.js';

export const channelItemFragment = graphql(`
    fragment ChannelItem on Channel {
        id
        createdAt
        updatedAt
        code
        token
        pricesIncludeTax
        availableCurrencyCodes
        availableLanguageCodes
        defaultCurrencyCode
        defaultLanguageCode
        defaultShippingZone {
            id
            name
        }
        defaultTaxZone {
            id
            name
        }
        seller {
            id
            name
        }
    }
`);

export const channelListQuery = graphql(
    `
        query ChannelList {
            channels {
                items {
                    ...ChannelItem
                }
                totalItems
            }
        }
    `,
    [channelItemFragment],
);
