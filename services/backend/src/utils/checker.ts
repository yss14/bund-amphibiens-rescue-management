type TypeNames =
  | "string"
  | "number"
  | "boolean"
  | "undefined"
  | "function"
  | "object";
type Types = string | number | boolean | undefined | Function | object | null;

type TypeNameType<T extends TypeNames> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "undefined"
  ? undefined
  : T extends "function"
  ? Function
  : object | null;

const isType = <T extends TypeNames>(
  name: T,
  value: unknown
): value is TypeNameType<T> => typeof value === name;

export type CheckValid<U> = [null, U];
export type CheckError = [string[]];
export type Check<U> = CheckError | CheckValid<U>;
export type Checker<A, B> = { (value: A): Check<B> };
export type CheckerInput<M> = M extends Checker<infer A, infer B> ? A : never;
export type CheckerSuccess<M> = M extends Checker<infer A, infer B> ? B : never;

export const isCheckValid = <U>(args: Check<U>): args is CheckValid<U> =>
  args[0] === null;
export const isCheckError = <U>(args: Check<U>): args is CheckError =>
  args[0] !== null;
export const Type =
  <T extends TypeNames>(name: T): Checker<unknown, TypeNameType<T>> =>
  (value) =>
    isType(name, value)
      ? [null, value]
      : [["expected " + name + " found " + JSON.stringify(value)]];
export const OneOf = <T extends Types[]>(
  ...items: T
): Checker<unknown, T[number]> => {
  return (value) => {
    for (const item of items) {
      if (item === value) {
        return [null, item];
      }
    }

    return [
      [
        "expected one of " +
          JSON.stringify(items) +
          " found " +
          JSON.stringify(value),
      ],
    ];
  };
};
export type ItemsSchema<T> = Checker<unknown, T>;
export const ItemsPartial = <T>(
  items: ItemsSchema<T>
): Checker<unknown[], T[]> => {
  const test = items;

  return (values) => {
    let index = 0;
    for (const value of values) {
      const result = test(value);
      if (isCheckError(result)) {
        return [result[0].map((error) => "[" + index + "] " + error)];
      }
      ++index;
    }

    return [null, <T[]>values];
  };
};
export type KeysSchema<T> = { [key in keyof T]: Checker<unknown, T[key]> };
export const KeysPartial = <T>(
  schema: KeysSchema<T>
): Checker<Partial<Record<keyof T, unknown>>, { [key in keyof T]: T[key] }> => {
  const keys = <(keyof T)[]>Object.keys(schema);
  const tests = keys.map((key) => {
    const test = schema[key];

    return (value: Partial<Record<keyof T, unknown>>): Check<T[keyof T]> => {
      const result = test(value[key]);
      if (isCheckError(result)) {
        return [result[0].map((error) => "." + key.toString() + " " + error)];
      }

      return result;
    };
  });

  return (value) => {
    for (const test of tests) {
      const result = test(value);
      if (isCheckError(result)) {
        return result;
      }
    }

    return [null, <{ [key in keyof T]: T[key] }>value];
  };
};
export const AndNot = <U, A, B>(
  a: Checker<U, A>,
  b: Checker<U, B>
): Checker<U, Exclude<A, B>> => {
  const testA = a;
  const testB = b;

  return (value) => {
    if (isCheckValid(testB(value))) {
      return [["ERROR"]];
    }
    const result = <Check<Exclude<A, B>>>testA(value);

    return result;
  };
};
export const And = <U, A, B>(
  a: Checker<U, A>,
  b: Checker<A, B>
): Checker<U, B> => {
  const testA = a;
  const testB = b;

  return (value) => {
    const result = testA(value);
    if (isCheckError(result)) {
      return result;
    }

    return testB(result[1]);
  };
};
export const Merge = <U, A, B>(
  a: Checker<U, A>,
  b: Checker<U, B>
): Checker<U, A & B> => {
  const testA = a;
  const testB = b;

  return (value) => {
    const result = testA(value);
    if (isCheckError(result)) {
      return result;
    }

    return <Check<A & B>>(<unknown>testB(value));
  };
};
export const Or = <T extends unknown[]>(
  ...types: { [key in keyof T]: Checker<unknown, T[key]> }
): Checker<unknown, T[number]> => {
  return (value) => {
    const errors: string[][] = [];
    for (const test of types) {
      const result = test(value);
      if (isCheckValid(result)) {
        return [null, <T[number]>value];
      }
      errors.push(result[0]);
    }

    return [(<string[]>[]).concat(...errors)];
  };
};

export const TypeParseInt: Checker<unknown, string> = (value) => {
  const string = TypeString(value);
  if (isCheckError(string)) {
    return string;
  }
  const number = parseInt(string[1], 10);
  if (isNaN(number)) {
    return [
      ["expected a string containing a number, found " + JSON.stringify(value)],
    ];
  }

  return string;
};

export const TypeUndefined = Type("undefined");
export const TypeObject = AndNot(Type("object"), OneOf(null));
export const TypeString = Type("string");
export const TypeBoolean = Type("boolean");
export const TypeNumber = Type("number");
export const TypeUnknown: Checker<unknown, unknown> = (value) => [null, value];
export const TypeArray = (value: unknown): Check<unknown[]> =>
  Array.isArray(value) ? [null, value] : [["expected an array"]];
export const TypeCheck =
  <U, T extends U>(check: (value: U) => value is T) =>
  (value: U): Check<T> =>
    check(value) ? [null, value] : [["expected custom type"]];
export const TypeEnum = <T>(_enum: T) =>
  <Checker<unknown, T[keyof T]>>(
    OneOf(
      ...Object.values(_enum as any).filter(
        (x): x is number => typeof x === "number"
      )
    )
  );
export const TypeEnumString = <T>(_enum: T) =>
  <Checker<unknown, T[keyof T]>>(
    OneOf(
      ...Object.values(_enum as any).filter(
        (x): x is number => typeof x === "string"
      )
    )
  );

export const Keys = <T>(schema: KeysSchema<T>) =>
  And(TypeObject, KeysPartial(schema));
export const Items = <T>(schema: ItemsSchema<T>) =>
  And(TypeArray, ItemsPartial(schema));
