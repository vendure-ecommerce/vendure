import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DataService } from './data/providers/data.service';
import { StateStore } from './state/state-store.service';

@Component({
    selector: 'vdr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    loading$: Observable<boolean>;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.loading$ = this.dataService.client.inFlightRequests().pipe(
            tap(val => console.log('inFlightRequests:', val)),
            map(count => 0 < count),
        );
    }
}
