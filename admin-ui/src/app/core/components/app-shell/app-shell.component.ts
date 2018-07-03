import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StateStore } from '../../../state/state-store.service';
import { AuthService } from '../../providers/auth/auth.service';

@Component({
    selector: 'vdr-app-shell',
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit {

    userName$: Observable<string>;

    constructor(private store: StateStore,
                private authService: AuthService,
                private router: Router) { }

    ngOnInit() {
        this.userName$ = this.store.select(state => state.user.username);
    }

    logOut() {
        this.authService.logOut();
        this.router.navigate(['/login']);
    }

}
