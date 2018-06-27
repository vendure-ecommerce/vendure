import { BaseDataService } from './base-data.service';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ProductDataService {

    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): Observable<any> {
        const query = gql`
            query ($take: Int, $skip: Int){
                products(languageCode: en, take: $take, skip: $skip) {
                    items {
                        id
                        languageCode
                        name
                        slug
                        description
                    }
                    totalItems
                }
            }
        `;
        return this.baseDataService.query<any>(query, { take, skip }).pipe(
            map(data => data.products),
        );
    }

}
