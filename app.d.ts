interface Array<T> {
  filter(predicate: BooleanConstructor): Array<NonNullable<T>>;
}

type DataUrlString = string;

type DistributiveOmit<T, K extends PropertyType> = T extends unknown ? Omit<T, K> : never;

type DistributivePick<T, K extends PropertyType> = T extends unknown ? Pick<T, K> : never;

type IsoDateString = string;

type IsoDateTimestamp = number;

type OptionalKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Primitive = boolean | number | string;

type PageParamsInput = {
  [K: string]: Array<Primitive> | Primitive;
};

type PageParams<T extends PageParamsInput> = {
  [K in keyof T as string extends K ? never : K]: Exclude<T[K], undefined> extends Primitive
    ? string
    : Array<string>;
};

type RequiredKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

type UriString = string;

type UrlString = string;

declare module '*.svg' {
  import type { StaticImageData } from 'next/future/image';

  const content: StaticImageData;

  export default content;
}
