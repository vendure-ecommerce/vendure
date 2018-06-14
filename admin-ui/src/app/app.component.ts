import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'vdr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Vendure';
  products: any[] = [];

  constructor(apollo: Apollo) {
    apollo.query<any>({
      query: gql`
        {
          products(languageCode: en) {
            id
            languageCode
            name
            slug
            description
          }
        }
      `
    })
    .subscribe(result => {
      this.products = result.data.products;
    })
  }
}
