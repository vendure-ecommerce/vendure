import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { UserActions } from './state/user/user-actions';

@Component({
    selector: 'vdr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'Vendure';
    products: any[] = [];

    constructor() {
    }

    ngOnInit() {

    }
}
