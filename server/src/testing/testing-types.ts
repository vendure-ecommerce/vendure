export type MockClass<T> = { [K in keyof T]: jest.Mock<any> };
