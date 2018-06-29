import { Injectable } from '@angular/core';

import { StateStore } from '../state-store.service';

import {Actions} from './api-state';

@Injectable()
export class ApiActions {

    constructor(private store: StateStore) {}

    startRequest(): void {
        this.store.dispatch(new Actions.StartRequest());
    }

    requestCompleted(): void {
        this.store.dispatch(new Actions.RequestCompleted());
    }
}
