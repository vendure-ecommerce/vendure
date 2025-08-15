/**
 * @description
 * A utility type that converts all properties in T that are `T | undefined` to be `T | null`.
 * This is useful when working with APIs that prefer null over undefined.
 *
 * @example
 * ```ts
 * interface User {
 *   id: string;
 *   name: string;
 *   email?: string;
 *   address?: {
 *     street?: string;
 *     city?: string;
 *   };
 * }
 *
 * // Results in:
 * // {
 * //   id: string;
 * //   name: string;
 * //   email: string | null;
 * //   address: {
 * //     street: string | null;
 * //     city: string | null;
 * //   } | null;
 * // }
 * type UserWithNulls = UndefinedToNull<User>;
 * ```
 *
 * @docsCategory common
 */
export type UndefinedToNull<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends undefined
              ? null
              : T[K] extends infer U | undefined
                ? U | null
                : UndefinedToNull<T[K]>;
      }
    : T;
