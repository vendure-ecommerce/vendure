import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateStore } from './state/state-store.service';

@Component({
    selector: 'vdr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    loading$: Observable<boolean>;

    constructor(private store: StateStore) {
    }

    ngOnInit() {
        this.loading$ = this.store.select(state => state.api.inFlightRequests).pipe(
            map(count => 0 < count),
        );
    }
}
