import { EventBus } from './event-bus';
import { VendureEvent } from './vendure-event';

describe('EventBus', () => {
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus();
    });

    it('can publish without subscribers', () => {
        const event = new TestEvent('foo');

        expect(() => eventBus.publish(event)).not.toThrow();
    });

    describe('ofType()', () => {
        it('single handler is called once', () => {
            const handler = jest.fn();
            const event = new TestEvent('foo');
            eventBus.ofType(TestEvent).subscribe(handler);

            eventBus.publish(event);

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(event);
        });

        it('single handler is called on multiple events', () => {
            const handler = jest.fn();
            const event1 = new TestEvent('foo');
            const event2 = new TestEvent('bar');
            const event3 = new TestEvent('baz');
            eventBus.ofType(TestEvent).subscribe(handler);

            eventBus.publish(event1);
            eventBus.publish(event2);
            eventBus.publish(event3);

            expect(handler).toHaveBeenCalledTimes(3);
            expect(handler).toHaveBeenCalledWith(event1);
            expect(handler).toHaveBeenCalledWith(event2);
            expect(handler).toHaveBeenCalledWith(event3);
        });

        it('multiple handlers are called', () => {
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            const handler3 = jest.fn();
            const event = new TestEvent('foo');
            eventBus.ofType(TestEvent).subscribe(handler1);
            eventBus.ofType(TestEvent).subscribe(handler2);
            eventBus.ofType(TestEvent).subscribe(handler3);

            eventBus.publish(event);

            expect(handler1).toHaveBeenCalledWith(event);
            expect(handler2).toHaveBeenCalledWith(event);
            expect(handler3).toHaveBeenCalledWith(event);
        });

        it('handler is not called for other events', () => {
            const handler = jest.fn();
            const event = new OtherTestEvent('foo');
            eventBus.ofType(TestEvent).subscribe(handler);

            eventBus.publish(event);

            expect(handler).not.toHaveBeenCalled();
        });

        it('ofType() returns a subscription', () => {
            const handler = jest.fn();
            const event = new TestEvent('foo');
            const subscription = eventBus.ofType(TestEvent).subscribe(handler);

            eventBus.publish(event);

            expect(handler).toHaveBeenCalledTimes(1);

            subscription.unsubscribe();

            eventBus.publish(event);
            eventBus.publish(event);

            expect(handler).toHaveBeenCalledTimes(1);
        });

        it('unsubscribe() only unsubscribes own handler', () => {
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            const event = new TestEvent('foo');
            const subscription1 = eventBus.ofType(TestEvent).subscribe(handler1);
            const subscription2 = eventBus.ofType(TestEvent).subscribe(handler2);

            eventBus.publish(event);

            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(1);

            subscription1.unsubscribe();

            eventBus.publish(event);
            eventBus.publish(event);

            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(3);
        });
    });
});

class TestEvent extends VendureEvent {
    constructor(public payload: string) {
        super();
    }
}

class OtherTestEvent extends VendureEvent {
    constructor(public payload: string) {
        super();
    }
}
