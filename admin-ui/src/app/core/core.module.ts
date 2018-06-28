import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { SharedModule } from '../shared/shared.module';
import { APOLLO_NGRX_CACHE, StateModule } from '../state/state.module';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BaseDataService } from './providers/data/base-data.service';
import { API_URL } from '../app.config';
import { LocalStorageService } from './providers/local-storage/local-storage.service';
import { DataService } from './providers/data/data.service';
import { AuthGuard } from './providers/guard/auth.guard';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export function createApollo(httpLink: HttpLink, ngrxCache: InMemoryCache) {
  return {
    link: httpLink.create({ uri: `${API_URL}/api` }),
    cache: ngrxCache,
  };
}

@NgModule({
    imports: [
        SharedModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        StateModule,
    ],
    exports: [
        SharedModule,
    ],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, APOLLO_NGRX_CACHE],
        },
        BaseDataService,
        LocalStorageService,
        DataService,
        AuthGuard,
    ],
    declarations: [AppShellComponent, UserMenuComponent, MainNavComponent, BreadcrumbComponent],
})
export class CoreModule {}
