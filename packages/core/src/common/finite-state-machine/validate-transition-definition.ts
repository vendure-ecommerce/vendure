import { Transitions } from './types';

type ValidationResult = { reachable: boolean };

/**
 * This function validates a finite state machine transition graph to ensure
 * that all states are reachable from the given initial state.
 */
export function validateTransitionDefinition<T extends string>(
    transitions: Transitions<T>,
    initialState: T,
): { valid: boolean; error?: string } {
    const states = Object.keys(transitions) as T[];
    const result: { [State in T]: ValidationResult } = states.reduce((res, state) => {
        return {
            ...res,
            [state]: { reachable: false },
        };
    }, {} as any);

    // walk the state graph starting with the initialState and
    // check whether all states are reachable.
    function allStatesReached(): boolean {
        return Object.values(result).every((r) => (r as ValidationResult).reachable);
    }
    function walkGraph(state: T) {
        const candidates = transitions[state].to;
        result[state].reachable = true;
        if (allStatesReached()) {
            return true;
        }
        for (const candidate of candidates) {
            if (!result[candidate].reachable) {
                walkGraph(candidate);
            }
        }
    }
    walkGraph(initialState);

    if (!allStatesReached()) {
        return {
            valid: false,
            error: `The following states are unreachable: ${Object.entries(result)
                .filter(([s, v]) => !(v as ValidationResult).reachable)
                .map(([s]) => s)
                .join(', ')}`,
        };
    } else {
        return {
            valid: true,
        };
    }
}
