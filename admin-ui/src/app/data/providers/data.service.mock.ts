import { of } from 'rxjs';

import { QueryResult } from '../query-result';

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
    administrator = {
        getAdministrators: spyQueryResult('getAdministrators'),
        getAdministrator: spyQueryResult('getAdministrator'),
        createAdministrator: spyObservable('createAdministrator'),
        updateAdministrator: spyObservable('updateAdministrator'),
        getRoles: spyQueryResult('getRoles'),
        getRole: spyQueryResult('getRole'),
        createRole: spyObservable('createRole'),
        updateRole: spyObservable('updateRole'),
    };
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
    order = {
        getOrders: spyQueryResult('getOrders'),
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
        applyFacetValuesToProductVariants: spyObservable('applyFacetValuesToProductVariants'),
        getAssetList: spyQueryResult('getAssetList'),
        createAssets: spyObservable('createAssets'),
    };
    auth = {
        checkLoggedIn: spyObservable('checkLoggedIn'),
        attemptLogin: spyObservable('attemptLogin'),
        logOut: spyObservable('logOut'),
    };
    facet = {
        getFacets: spyQueryResult('getFacets'),
        getFacet: spyQueryResult('getFacet'),
        createFacet: spyObservable('createFacet'),
        updateFacet: spyObservable('updateFacet'),
        createFacetValues: spyObservable('createFacetValues'),
        updateFacetValues: spyObservable('updateFacetValues'),
    };
}
