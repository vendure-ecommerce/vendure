import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data/providers/data.service';
import { FloatingButton } from './floating-button-types';
@Injectable({
    providedIn: 'root',
})
export class FloatingButtonService {
    constructor(
        private injector: Injector,
        private dataService: DataService,
    ) {}

    handleClick(button: FloatingButton) {
        button.onClick(this.injector);
    }

    getFloatingButtons(): Observable<FloatingButton[]> {
        return of(this.addedFloatingButtons);
    }
    private addedFloatingButtons: FloatingButton[] = [];

    addFloatingButton(config: Omit<FloatingButton, 'visible'>) {
        this.addedFloatingButtons.push(config);
    }
}
