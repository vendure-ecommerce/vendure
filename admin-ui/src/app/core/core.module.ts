import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { API_PATH } from '../../../../shared/shared-constants';
import { API_URL } from '../app.config';
import { SharedModule } from '../shared/shared.module';
import { APOLLO_NGRX_CACHE, StateModule } from '../state/state.module';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { BaseDataService } from './providers/data/base-data.service';
import { DataService } from './providers/data/data.service';
import { DefaultInterceptor } from './providers/data/interceptor';
import { AuthGuard } from './providers/guard/auth.guard';
import { LocalStorageService } from './providers/local-storage/local-storage.service';
import { OverlayHostComponent } from './components/overlay-host/overlay-host.component';
import { OverlayHostService } from './providers/overlay-host/overlay-host.service';
import { NotificationService } from './providers/notification/notification.service';
import { NotificationComponent } from './components/notification/notification.component';

export function createApollo(httpLink: HttpLink, ngrxCache: InMemoryCache) {
  return {
    link: httpLink.create({ uri: `${API_URL}/${API_PATH}` }),
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
        OverlayHostComponent,
    ],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, APOLLO_NGRX_CACHE],
        },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        BaseDataService,
        LocalStorageService,
        DataService,
        AuthGuard,
        OverlayHostService,
        NotificationService,
    ],
    declarations: [AppShellComponent, UserMenuComponent, MainNavComponent, BreadcrumbComponent, OverlayHostComponent, NotificationComponent],
    entryComponents: [NotificationComponent],
})
export class CoreModule {}
