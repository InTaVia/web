import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@intavia/ui';

import { useI18n } from '@/app/i18n/use-i18n';

interface DeleteCollectionAlertDialogProps {
  onDelete: () => void;
  label: string;
  count: string;
}

export function DeleteCollectionAlertDialog(props: DeleteCollectionAlertDialogProps): JSX.Element {
  const { onDelete, label, count } = props;

  const { t } = useI18n<'common'>();

  return (
    <AlertDialogContent className="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>{t(['common', 'collections', 'delete-alert-title'])}</AlertDialogTitle>
        <AlertDialogDescription>
          <p>
            {t(['common', 'collections', 'delete-alert-description'], {
              values: {
                collectionLabel: label,
                collectionEntityCount: count,
              },
            })}
          </p>
          <br />
          <p>{t(['common', 'collections', 'delete-alert-description-warning'])}</p>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button>{t(['common', 'form', 'cancel'])}</Button>
        </AlertDialogCancel>
        <Button variant="destructive" onClick={onDelete}>
          {t(['common', 'collections', 'delete-alert-action'])}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
