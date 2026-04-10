import type { Locales, LocaleSchema, MessageFunction } from '.';

// type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } & {} : T;
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type UnionKeys<T> = T extends T ? keyof T : never;
type UnionMerge<T> = { [K in UnionKeys<T>]: T extends Record<K, infer V> ? V : never; };
type DecrementDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type Prefix<P extends string, K> = P extends '' ? `${K & string}` : `${P}.${K & string}`;
export type GetMessageArgs<T> = T extends (...args: infer A) => string ? A : any[];
export type MakeReturn<T, K extends keyof T> = T[K] extends (...args: any[]) => infer R ? R : T[K];

export type GetPaths<T, P extends string = '', Depth extends number = 5>
  = [Depth] extends [never] ? never : {
    [K in keyof T]:
    T[K] extends (...args: any[]) => any
      ? Prefix<P, K>
      : T[K] extends object
        ? GetPaths<T[K], Prefix<P, K>, DecrementDepth[Depth]>
        : Prefix<P, K>
  }[keyof T];

export type PathValue<T, P>
  = P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? PathValue<T[Key], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never;

export type FlatLocaleSchema<T> = {
  [P in GetPaths<T>]: PathValue<T, P>
};

export type FlatLocales<T extends Locales<any>> = UnionMerge<
  { [K in keyof T]: T[K] extends () => Promise<infer LS>
    ? FlatLocaleSchema<LS>
    : T[K] extends LocaleSchema
      ? FlatLocaleSchema<T[K]>
      : never
  }[keyof T]
>;

export function getMessageByPath(current: LocaleSchema, path: string): string | MessageFunction | null {
  for (const segment of path.split('.')) {
    if (typeof current[segment] !== 'object') return current[segment] ?? null;
    current = current[segment];
  }

  return null;
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
