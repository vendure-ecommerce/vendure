/**
 * Helper method for creating tests which assert a given error message when the operation is attempted.
 */
export function assertThrowsWithMessage(operation: () => Promise<any>, message: string | (() => string)) {
    return async () => {
        try {
            await operation();
            fail('Should have thrown');
        } catch (err) {
            const messageString = typeof message === 'function' ? message() : message;
            expect(err.message).toEqual(expect.stringContaining(messageString));
        }
    };
}
