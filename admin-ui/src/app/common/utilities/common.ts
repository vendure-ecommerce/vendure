/**
 * Like assertNever, but at runtime this will be reached due to the way that all actions
 * are dispatched and piped through all reducers. So this just provides a compile-time
 * exhaustiveness check for those reducers which use a switch statement over
 * a discriminated union type of actions.
 */
export function reducerCaseNever(x: never, errorMessage?: string): void {
    // this function intentionally left empty
}
