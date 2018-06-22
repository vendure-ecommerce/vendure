export interface UserResponse {
    id: string | number;
    identifier: string;
    roles: string[];
}

export interface LoginResponse {
    token: string;
    user: UserResponse;
}
