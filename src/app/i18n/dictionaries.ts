import type { Dictionary as CommonDictionary } from '@/app/i18n/common';

export type Plurals = Partial<Record<Intl.LDMLPluralRule, string>>;

export interface Dictionaries {
  common: CommonDictionary;
}

export interface DictionariesProps<K extends keyof Dictionaries = never> {
  dictionaries: Pick<Dictionaries, K>;
}
