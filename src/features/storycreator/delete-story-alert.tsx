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

interface DeleteStoryAlertDialogProps {
  onDelete: () => void;
  label: string;
}

export function DeleteStoryAlertDialog(props: DeleteStoryAlertDialogProps): JSX.Element {
  const { onDelete, label } = props;

  const { t } = useI18n<'common'>();

  return (
    <AlertDialogContent className="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>{t(['common', 'stories', 'delete-alert-title'])}</AlertDialogTitle>
        <AlertDialogDescription>
          <p>
            {t(['common', 'stories', 'delete-alert-description'], {
              values: {
                storyLabel: label,
              },
            })}
          </p>
          <br />
          <p>{t(['common', 'stories', 'delete-alert-description-warning'])}</p>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button>{t(['common', 'form', 'cancel'])}</Button>
        </AlertDialogCancel>
        <Button variant="destructive" onClick={onDelete}>
          {t(['common', 'stories', 'delete-alert-action'])}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
