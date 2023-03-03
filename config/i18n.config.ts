export const locales = ["en"] as const;

export type Locales = typeof locales;
export type Locale = Locales[number];

export const defaultLocale: Locale = "en";
