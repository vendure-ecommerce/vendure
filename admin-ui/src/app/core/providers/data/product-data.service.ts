import { BaseDataService } from './base-data.service';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ProductDataService {

    constructor(private baseDataService: BaseDataService) {}

    getProducts(): Observable<any[]> {
        const query = gql`
            {
                products(languageCode: en) {
                    id
                    languageCode
                    name
                    slug
                    description
                    translations {
                        id
                        languageCode
                        name
                    }
                }
            }
        `;
        return this.baseDataService.query<any>(query).pipe(
            map(data => data.products),
        );
    }

}
