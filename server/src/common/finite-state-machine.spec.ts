import { of } from 'rxjs';

import { FSM, Transitions } from './finite-state-machine';

describe('Finite State Machine', () => {
    type TestState = 'DoorsClosed' | 'DoorsOpen' | 'Moving';

    const transitions: Transitions<TestState> = {
        DoorsClosed: {
            to: ['Moving', 'DoorsOpen'],
        },
        DoorsOpen: {
            to: ['DoorsClosed'],
        },
        Moving: {
            to: ['DoorsClosed'],
        },
    };

    it('initialState works', () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>({ transitions }, initialState);

        expect(fsm.initialState).toBe(initialState);
    });

    it('getNextStates() works', () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>({ transitions }, initialState);

        expect(fsm.getNextStates()).toEqual(['Moving', 'DoorsOpen']);
    });

    it('allows valid transitions', () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>({ transitions }, initialState);

        fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe('Moving');
        fsm.transitionTo('DoorsClosed');
        expect(fsm.currentState).toBe('DoorsClosed');
        fsm.transitionTo('DoorsOpen');
        expect(fsm.currentState).toBe('DoorsOpen');
        fsm.transitionTo('DoorsClosed');
        expect(fsm.currentState).toBe('DoorsClosed');
    });

    it('does not allow invalid transitions', () => {
        const initialState = 'DoorsOpen';
        const fsm = new FSM<TestState>({ transitions }, initialState);

        fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe('DoorsOpen');
        fsm.transitionTo('DoorsClosed');
        expect(fsm.currentState).toBe('DoorsClosed');
        fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe('Moving');
        fsm.transitionTo('DoorsOpen');
        expect(fsm.currentState).toBe('Moving');
    });

    it('onTransitionStart() is invoked before a transition takes place', () => {
        const initialState = 'DoorsClosed';
        const spy = jest.fn();
        const data = 123;
        let currentStateDuringCallback = '';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: spy.mockImplementation(() => {
                    currentStateDuringCallback = fsm.currentState;
                }),
            },
            initialState,
        );

        fsm.transitionTo('Moving', data);

        expect(spy).toHaveBeenCalledWith(initialState, 'Moving', data);
        expect(currentStateDuringCallback).toBe(initialState);
    });

    it('onTransitionEnd() is invoked after a transition takes place', () => {
        const initialState = 'DoorsClosed';
        const spy = jest.fn();
        const data = 123;
        let currentStateDuringCallback = '';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionEnd: spy.mockImplementation(() => {
                    currentStateDuringCallback = fsm.currentState;
                }),
            },
            initialState,
        );

        fsm.transitionTo('Moving', data);

        expect(spy).toHaveBeenCalledWith(initialState, 'Moving', data);
        expect(currentStateDuringCallback).toBe('Moving');
    });

    it('onTransitionStart() cancels transition when it returns false', async () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: () => false,
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe(initialState);
    });

    it('onTransitionStart() cancels transition when it returns Promise<false>', async () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: () => Promise.resolve(false),
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe(initialState);
    });

    it('onTransitionStart() cancels transition when it returns Observable<false>', async () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: () => of(false),
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe(initialState);
    });

    it('onTransitionStart() cancels transition when it returns a string', async () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: () => 'foo',
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe(initialState);
    });

    it('onTransitionStart() allows transition when it returns true', async () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: () => true,
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe('Moving');
    });

    it('onTransitionStart() allows transition when it returns void', async () => {
        const initialState = 'DoorsClosed';
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: () => {
                    /* empty */
                },
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(fsm.currentState).toBe('Moving');
    });

    it('onError() is invoked for invalid transitions', async () => {
        const initialState = 'DoorsOpen';
        const spy = jest.fn();
        const fsm = new FSM<TestState>(
            {
                transitions,
                onError: spy,
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(spy).toHaveBeenCalledWith(initialState, 'Moving', undefined);
    });

    it('onTransitionStart() invokes onError() if it returns a string', async () => {
        const initialState = 'DoorsClosed';
        const spy = jest.fn();
        const fsm = new FSM<TestState>(
            {
                transitions,
                onTransitionStart: () => 'error',
                onError: spy,
            },
            initialState,
        );

        await fsm.transitionTo('Moving');
        expect(spy).toHaveBeenCalledWith(initialState, 'Moving', 'error');
    });
});
