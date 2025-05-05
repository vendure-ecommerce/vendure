export interface WebSocketRequest {
    connectionParams: {
        Authorization: string;
        [key: string]: any;
    };
}
