import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';

@NgModule({
    imports: [
        ClarityModule,
    ],
    exports: [
        ClarityModule,
    ],
})
export class SharedModule {

}
