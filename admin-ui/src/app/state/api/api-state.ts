import { Action } from '@ngrx/store';

export interface ApiState {
    inFlightRequests: number;
}

export const initialApiState: ApiState = {
    inFlightRequests: 0,
};

export enum ActionType  {
    START_REQUEST = 'api/START_REQUEST',
    REQUEST_COMPLETED = 'api/REQUEST_COMPLETED',
}

export class StartRequest implements Action {
    readonly type = ActionType.START_REQUEST;
}

export class RequestCompleted implements Action {
    readonly type = ActionType.REQUEST_COMPLETED;
}

export const Actions = {
    StartRequest,
    RequestCompleted,
};

export type Actions =
    StartRequest |
    RequestCompleted;
