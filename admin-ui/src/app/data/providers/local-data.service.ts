import { Observable } from 'rxjs';

import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { BaseDataService } from './base-data.service';

export class LocalDataService {

    constructor(private baseDataService: BaseDataService) {}

    startRequest() {
        return this.baseDataService.mutate(gql`
            mutation {
                requestStarted @client
            }
        `);
    }

    completeRequest() {
        return this.baseDataService.mutate(gql`
            mutation {
                requestCompleted @client
            }
        `);
    }

    inFlightRequests(): Observable<number> {
        return this.baseDataService.query<any>(gql`
            query {
                network @client {
                    inFlightRequests
                }
            }
        `).valueChanges.pipe(
            map(result => result.data.network.inFlightRequests),
        );
    }

}

