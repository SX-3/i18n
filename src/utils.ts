import type { Locales, LocaleSchema, MessageFunction } from '.';

type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } & {} : T;
type DecrementDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type Prefix<P extends string, K> = P extends '' ? `${K & string}` : `${P}.${K & string}`;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type GetPaths<T, P extends string = '', Depth extends number = 5> = [Depth] extends [never] ? never : {
  [K in keyof T]: T[K] extends string | MessageFunction ? Prefix<P, K> : GetPaths<T[K], Prefix<P, K>, DecrementDepth[Depth]>
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

export type FlatLocales<T extends Locales<any>> = UnionToIntersection<Simplify<{
  [K in keyof T]:
  T[K] extends LocaleSchema
    ? FlatLocaleSchema<T[K]>
    : T[K] extends () => Promise<infer LS>
      ? FlatLocaleSchema<LS>
      : never
}[keyof T]>>;

export type GetMessageArgs<T> = T extends (...args: infer A) => string ? A : any[];

export function getMessageByPath(current: LocaleSchema, path: string): string | MessageFunction | null {
  for (const segment of path.split('.')) {
    if (typeof current[segment] !== 'object') return current[segment] ?? null;
    current = current[segment];
  }

  return null;
}
