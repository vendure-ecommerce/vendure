import produce from 'immer';

import {reducerCaseNever} from '../../common/utilities/common';

import {Actions, ActionType, initialUserState, UserState} from './user-state';

/**
 * Reducer for user (auth state etc.)
 */
export function user(state: UserState = initialUserState, action: Actions): UserState {
    return produce(state, draft => {
        switch (action.type) {

            case ActionType.LOGIN:
                draft.loggingIn = true;
                return;

            case ActionType.LOGIN_SUCCESS:
                draft.username = action.payload.username;
                draft.loggingIn = false;
                draft.isLoggedIn = true;
                draft.loginTime = action.payload.loginTime;
                return;

            case ActionType.LOGIN_ERROR:
                draft.loggingIn = false;
                draft.isLoggedIn = false;
                return;

            case ActionType.LOGOUT:
                draft.username = '';
                draft.loggingIn = false;
                draft.isLoggedIn = false;
                draft.loginTime = -1;
                return;

            default:
                reducerCaseNever(action);
        }
    });
}
