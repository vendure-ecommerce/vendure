export class VendureClientError extends Error {
    constructor(public response: any, public request: any) {
        super(VendureClientError.extractMessage(response));
    }
    private static extractMessage(response: any): string {
        if (response.errors) {
            return response.errors[0].message;
        } else {
            return `GraphQL Error (Code: ${response.status as number})`;
        }
    }
}
