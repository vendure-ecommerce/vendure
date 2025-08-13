import { describe, expect, it } from 'vitest';

import { Override } from '../../src/common/decorators/override.decorator';

describe('@Override() decorator', () => {
    it('should not throw when method correctly overrides', () => {
        class Base {
            myMethod() {
                return 'base';
            }
        }

        class Child extends Base {
            @Override()
            override myMethod() {
                return 'child';
            }
        }

        const instance = new Child();
        expect(instance.myMethod()).toBe('child');
    });

    it('should throw when method does not override due to typo', () => {
        class Base {
            myMethod() {
                return 'base';
            }
        }

        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            class Child extends Base {
                @Override()
                override myMthod() {
                    // Typo in method name
                    return 'child';
                }
            }
        }).toThrow(
            `The method "myMthod" in class "Child" is marked with @Override but does not override any method in the superclass "Base".`,
        );
    });

    it('should throw on a class with no superclass', () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            class NoSuper {
                @Override()
                myMethod() {
                    return 'test';
                }
            }
        }).toThrow(
            `The method "myMethod" in class "NoSuper" is marked with @Override but does not override any method in the superclass "Object".`,
        );
    });

    it('should not throw when static method correctly overrides', () => {
        class Base {
            static myStaticMethod() {
                return 'base';
            }
        }

        class Child extends Base {
            @Override()
            static override myStaticMethod() {
                return 'child';
            }
        }

        expect(Child.myStaticMethod()).toBe('child');
    });

    it('should throw when static method does not override', () => {
        class Base {
            static myStaticMethod() {
                return 'base';
            }
        }

        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            class Child extends Base {
                @Override()
                static override myStaticMthod() {
                    // Typo
                    return 'child';
                }
            }
        }).toThrow(
            `The method "myStaticMthod" in class "Child" is marked with @Override but does not override any method in the superclass "Base".`,
        );
    });
});
