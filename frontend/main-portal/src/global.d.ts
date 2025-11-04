export {};

declare global {
  /**
   * DeepPartial<T>
   * - Gets a type with all properties of T set to optional, recursively.
   * VD: DeepPartial<{a: {b: string}} > => {a?: {b?: string} }
   */
  export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Record<string, unknown>
      ? DeepPartial<T[K]>
      : T[K];
  };

  /** DeepNullable<T>
   * - Gets a type with all properties of T set to nullable, recursively.
   * VD: DeepNullable<{a: {b: string}} > => {a: {b: string} | null } | null
   */
  export type DeepNullable<T> = {
    [K in keyof T]: T[K] extends Record<string, unknown>
      ? DeepNullable<T[K]> | null
      : T[K] | null;
  };


  /**
   * ArrayElement<T>
   * - Gets the type of an element in an array
   *   VD: ArrayElement<string[]> => string
   */
  export type TArrayElement<T extends readonly unknown[]> = T[number];

  /**
   * KeysOfArrayElement<T>
   * - Gets the keys of an element in an array (if the element is an object)
   *   VD: KeysOfArrayElement<{id: string; name: string}[]> => "id" | "name"
   */
  export type TKeysOfArrayElement<T extends readonly Record<string, unknown>[]> =
    keyof TArrayElement<T>;

  /**
   * ValuesOfArrayElement<T>
   * - Gets the values of an element in an array (if the element is an object)
   *   VD: ValuesOfArrayElement<{id: string; name: string}[]> => string
   */
  export type TValuesOfArrayElement<
    T extends readonly Record<string, unknown>[]
  > = TArrayElement<T>[keyof TArrayElement<T>];
}
