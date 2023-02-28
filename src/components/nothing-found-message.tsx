import type { ReactNode } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';

interface NothingFoundMessageProps {
  children?: ReactNode;
}

export function NothingFoundMessage(props: NothingFoundMessageProps): JSX.Element {
  const { children } = props;

  const { t } = useI18n<'common'>();

  return (
    <div className="text-neutral-500">{children ?? t(['common', 'search', 'nothing-found'])}</div>
  );
}
