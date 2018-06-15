import { Component, OnInit } from '@angular/core';
import { UserActions } from '../../../state/user/user-actions';
import { Router } from '@angular/router';

@Component({
    selector: 'vdr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

    username = '';
    password = '';
    lastError = '';

    constructor(private userActions: UserActions,
                private router: Router) { }

    logIn(): void {
        this.userActions.logIn(this.username, this.password)
            .subscribe(
                () => {
                    console.log('logged in!');
                    this.router.navigate(['/']);
                },
                (err) => {
                    if (err.status === 401) {
                        this.lastError = 'Invalid username or password';
                    } else {
                        this.lastError = err.error;
                    }
                });
    }

}
