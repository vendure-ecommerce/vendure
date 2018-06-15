import {Action} from '@ngrx/store';

export interface UserState {
    username: any;
    loggingIn: boolean;
    isLoggedIn: boolean;
    loginTime: number;
}

export const initialUserState = {
    username: '',
    loggingIn: false,
    isLoggedIn: false,
    loginTime: -1,
};

export enum ActionType  {
    CHECK_LOGGED_IN = 'user/CHECK_LOGGED_IN',
    LOGIN = 'user/LOGIN',
    LOGIN_SUCCESS = 'user/LOGIN_SUCCESS',
    LOGIN_ERROR = 'user/LOGIN_ERROR',
    LOGOUT = 'user/LOGOUT',
}

export class CheckLoggedIn implements Action {
    readonly type = ActionType.LOGIN;
}

export class Login implements Action {
    readonly type = ActionType.LOGIN;
}

export class LoginSuccess implements Action {
    readonly type = ActionType.LOGIN_SUCCESS;
    constructor(public payload: { username: string; loginTime: number }) {}
}

export class LoginError implements Action {
    readonly type = ActionType.LOGIN_ERROR;
    constructor(public payload: any) {}
}

export class Logout implements Action {
    readonly type = ActionType.LOGOUT;
}

export const Actions = {
    CheckLoggedIn,
    Login,
    LoginSuccess,
    LoginError,
    Logout,
};

export type Actions =
    CheckLoggedIn |
    Login |
    LoginSuccess |
    LoginError |
    Logout;
