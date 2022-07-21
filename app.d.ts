type GetKind<Union, Kind> = Extract<Union, { kind: Kind }>;

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type IsoDateString = string;

declare module '@tailwindcss/line-clamp';
