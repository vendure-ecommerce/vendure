import { ActionReducer } from '@ngrx/store';
import { AppState } from './app-state';
import { storeLogger } from 'ngrx-store-logger';

/**
 * A meta reducer which logs actions to the console for debugging purposes.
 */
export function actionLogger(reducer: ActionReducer<AppState>): any {
    const key = 'vdr_logToConsole';
    const localSetting = sessionStorage.getItem(key);
    let logToConsole = localSetting === 'true';

    Object.defineProperty(window, 'vdr_log_actions', {
        get: () => {
            return logToConsole ? 'Logging actions enabled' : 'No longer logging actions';
        },
        set: (active: any) => {
            logToConsole = !!active;
            sessionStorage.setItem(key, logToConsole.toString());
        },
    });

    return (state, action) => {
        if (logToConsole) {
            return storeLogger({
                collapsed: true,
            })(reducer)(state, action);
        } else {
            return reducer(state, action);
        }
    };

}
