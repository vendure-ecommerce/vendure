import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloLink } from '@apollo/client/link/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { createUploadLink } from 'apollo-upload-client';

import { getAppConfig } from '../app.config';
import { introspectionResult } from '../common/introspection-result-wrapper';
import { getDefaultUiLanguage } from '../common/utilities/get-default-ui-language';
import { LocalStorageService } from '../providers/local-storage/local-storage.service';

import { CheckJobsLink } from './check-jobs-link';
import { getClientDefaults } from './client-state/client-defaults';
import { clientResolvers } from './client-state/client-resolvers';
import { GET_CLIENT_STATE } from './definitions/client-definitions';
import { OmitTypenameLink } from './omit-typename-link';
import { BaseDataService } from './providers/base-data.service';
import { DataService } from './providers/data.service';
import { FetchAdapter } from './providers/fetch-adapter';
import { DefaultInterceptor } from './providers/interceptor';
import { initializeServerConfigService, ServerConfigService } from './server-config';
import { getServerLocation } from './utils/get-server-location';

export function createApollo(
    localStorageService: LocalStorageService,
    fetchAdapter: FetchAdapter,
    injector: Injector,
): ApolloClientOptions<any> {
    const { adminApiPath, tokenMethod } = getAppConfig();
    const serverLocation = getServerLocation();
    const apolloCache = new InMemoryCache({
        possibleTypes: introspectionResult.possibleTypes,
        typePolicies: {
            GlobalSettings: {
                fields: {
                    serverConfig: {
                        merge: (existing, incoming) => ({ ...existing, ...incoming }),
                    },
                },
            },
        },
    });
    apolloCache.writeQuery({
        query: GET_CLIENT_STATE,
        data: getClientDefaults(localStorageService),
    });

    if (!false) {
        // TODO: enable only for dev mode
        // make the Apollo Cache inspectable in the console for debug purposes
        (window as any)['apolloCache'] = apolloCache;
    }
    return {
        link: ApolloLink.from([
            new OmitTypenameLink(),
            new CheckJobsLink(injector),
            setContext(() => {
                const headers: Record<string, string> = {};
                const channelToken = localStorageService.get('activeChannelToken');
                if (channelToken) {
                    headers['vendure-token'] = channelToken;
                }
                if (tokenMethod === 'bearer') {
                    const authToken = localStorageService.get('authToken');
                    if (authToken) {
                        headers.authorization = `Bearer ${authToken}`;
                    }
                }
                return { headers };
            }),
            createUploadLink({
                uri: `${serverLocation}/${adminApiPath}`,
                fetch: fetchAdapter.fetch,
            }),
        ]),
        cache: apolloCache,
        resolvers: clientResolvers,
    };
}

/**
 * On bootstrap, this function will fetch the available languages from the GlobalSettings and compare it
 * to the currently-configured content language to ensure that the content language is actually one
 * of the available languages.
 */
export function initContentLanguage(
    serverConfigService: ServerConfigService,
    localStorageService: LocalStorageService,
    dataService: DataService,
): () => Promise<any> {
    // Why store in a intermediate variable? https://github.com/angular/angular/issues/23629
    const result = async () => {
        const availableLanguages = await serverConfigService.getAvailableLanguages().toPromise();
        const contentLang = localStorageService.get('contentLanguageCode') || getDefaultUiLanguage();
        if (availableLanguages.length && !availableLanguages.includes(contentLang)) {
            dataService.client.setContentLanguage(availableLanguages[0]).subscribe(() => {
                localStorageService.set('contentLanguageCode', availableLanguages[0]);
            });
        }
    };
    return result;
}

/**
 * The DataModule is responsible for all API calls *and* serves as the source of truth for global app
 * state via the apollo-link-state package.
 */
@NgModule({
    imports: [HttpClientModule],
    exports: [],
    declarations: [],
    providers: [
        BaseDataService,
        DataService,
        FetchAdapter,
        ServerConfigService,
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [LocalStorageService, FetchAdapter, Injector],
        },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: initializeServerConfigService,
            deps: [ServerConfigService],
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: initContentLanguage,
            deps: [ServerConfigService, LocalStorageService, DataService],
        },
    ],
})
export class DataModule {}
