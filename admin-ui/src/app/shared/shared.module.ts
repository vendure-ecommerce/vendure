import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const IMPORTS = [
    ClarityModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
];

@NgModule({
    imports: IMPORTS,
    exports: IMPORTS,
})
export class SharedModule {

}
