export interface UserResponse {
    id: number;
    identifier: string;
    roles: string[];
}

export interface LoginResponse {
    token: string;
    user: UserResponse;
}
