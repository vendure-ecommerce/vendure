import { of } from 'rxjs';

import { QueryResult } from '../types/query-result';

import { DataService } from './data.service';

export type DataServiceSectionMock<T> = { [K in keyof T]: jasmine.Spy };

export type DataServiceMock = { [K in keyof DataService]: DataServiceSectionMock<DataService[K]> };

export type MockQueryResult = { [K in keyof QueryResult<any>]: any };

export function spyQueryResult(name: string): jasmine.Spy {
    const mockQueryResult: MockQueryResult = {
        ref: {},
        stream$: of({}),
        single$: of({}),
        mapStream() {
            return of({});
        },
        mapSingle() {
            return of({});
        },
    };
    return jasmine.createSpy(name).and.returnValue(mockQueryResult);
}

export function spyObservable(name: string, returnValue: any = {}): jasmine.Spy {
    return jasmine.createSpy(name).and.returnValue(of(returnValue));
}

export class MockDataService implements DataServiceMock {
    client = {
        startRequest: spyObservable('startRequest'),
        completeRequest: spyObservable('completeRequest'),
        getNetworkStatus: spyObservable('getNetworkStatus'),
        loginSuccess: spyObservable('loginSuccess'),
        logOut: spyObservable('logOut'),
        userStatus: spyQueryResult('userStatus'),
        uiState: spyQueryResult('uiState'),
        setUiLanguage: spyObservable('setUiLanguage'),
    };
    product = {
        getProducts: spyQueryResult('getProducts'),
        getProduct: spyQueryResult('getProduct'),
        createProduct: spyObservable('createProduct'),
        updateProduct: spyObservable('updateProduct'),
        updateProductVariants: spyObservable('updateProductVariants'),
        createProductOptionGroups: spyObservable('createProductOptionGroups'),
        addOptionGroupToProduct: spyObservable('addOptionGroupToProduct'),
        removeOptionGroupFromProduct: spyObservable('removeOptionGroupFromProduct'),
        getProductOptionGroups: spyQueryResult('getProductOptionGroups'),
        generateProductVariants: spyObservable('generateProductVariants'),
    };
    user = {
        checkLoggedIn: spyObservable('checkLoggedIn'),
        attemptLogin: spyObservable('attemptLogin'),
    };
    facet = {
        getFacets: spyQueryResult('getFacets'),
    };
}
