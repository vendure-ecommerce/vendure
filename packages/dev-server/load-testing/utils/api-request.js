// @ts-check
import http from 'k6/http';
import { check, fail } from 'k6';

export class ShopApiRequest {
    constructor(fileName) {
        this.document = open('../graphql/' + fileName);
    }

    /**
     * Post the GraphQL request
     */
    post(variables = {}) {
        const res = http.post('http://localhost:3000/shop-api/', {
            query: this.document,
            variables: JSON.stringify(variables),
        }, {
            timeout: 120 * 1000,
        });
        check(res, {
            'Did not error': r => r.json().errors == null && r.status === 200,
        });
        const result = res.json();
        if (result.errors) {
            fail('Errored: ' + result.errors[0].message);
        }
        return res.json();
    }
}
