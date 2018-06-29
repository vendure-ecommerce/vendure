import produce from 'immer';

import {reducerCaseNever} from '../../common/utilities/common';

import {Actions, ActionType, ApiState, initialApiState} from './api-state';

/**
 * Reducer for user (auth state etc.)
 */
export function api(state: ApiState = initialApiState, action: Actions): ApiState {
    return produce(state, draft => {
        switch (action.type) {

            case ActionType.START_REQUEST:
                draft.inFlightRequests++;
                return draft;

            case ActionType.REQUEST_COMPLETED:
                draft.inFlightRequests--;
                return draft;

            default:
                reducerCaseNever(action);
        }
    });
}
