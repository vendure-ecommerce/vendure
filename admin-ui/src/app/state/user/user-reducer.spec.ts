import { user } from './user-reducer';
import { Actions, UserState } from './user-state';

describe('user reducer', () => {

    it('should handle LOGIN', () => {
        const state = {} as UserState;
        const action = new Actions.Login();
        const newState = user(state, action);

        expect(newState).toEqual({
            loggingIn: true,
        } as any);
    });

    it('should handle LOGIN_SUCCESS', () => {
        const state = {
            loggingIn: true,
            loginTime: -1,
        } as UserState;
        const action = new Actions.LoginSuccess({
            username: 'test',
            loginTime: 12345,
        });
        const newState = user(state, action);

        expect(newState).toEqual({
            username: 'test',
            loggingIn: false,
            isLoggedIn: true,
            loginTime: 12345,
        } as any);
    });

    it('should handle LOGIN_ERROR', () => {
        const state = {
            loggingIn: true,
        } as UserState;
        const action = new Actions.LoginError({ message: 'an error message' });
        const newState = user(state, action);

        expect(newState).toEqual({
            loggingIn: false,
            isLoggedIn: false,
        } as any);
    });

    it('should handle LOGOUT', () => {
        const state = {
            username: 'test',
            isLoggedIn: true,
            loginTime: 12345,
        } as UserState;
        const action = new Actions.Logout();
        const newState = user(state, action);

        expect(newState).toEqual({
            username: '',
            loggingIn: false,
            isLoggedIn: false,
            loginTime: -1,
        } as any);
    });

});
