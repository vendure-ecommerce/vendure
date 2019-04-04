/**
 * Helper method for creating tests which assert a given error message when the operation is attempted.
 */
export function assertThrowsWithMessage(operation: () => Promise<any>, message: string) {
    return async () => {
        try {
            await operation();
            fail('Should have thrown');
        } catch (err) {
            expect(err.message).toEqual(expect.stringContaining(message));
        }
    };
}
