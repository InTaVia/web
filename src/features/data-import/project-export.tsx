import { ArrowDownIcon } from '@heroicons/react/outline';
import { Button } from '@intavia/ui';
import { useStore } from 'react-redux';

import { useI18n } from '@/app/i18n/use-i18n';

export function ProjectExport(): JSX.Element {
  const { t } = useI18n<'common'>();

  const store = useStore();

  function formatDateToCustomPattern(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
  }

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(store.getState(), null, 2),
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `intavia-project-${formatDateToCustomPattern(new Date())}.json`;

    link.click();
  };

  return (
    <Button className="w-fit" type="button" onClick={exportData}>
      <ArrowDownIcon className="h-5 w-5" />
      Export Project
    </Button>
  );
}
