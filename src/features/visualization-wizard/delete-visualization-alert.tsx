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

interface DeleteVisualizationAlertDialogProps {
  onDelete: () => void;
  visualizationId: string;
  visualizationType: string;
}

export function DeleteVisualizationAlertDialog(
  props: DeleteVisualizationAlertDialogProps,
): JSX.Element {
  const { onDelete, visualizationId, visualizationType } = props;

  const { t } = useI18n<'common'>();

  return (
    <AlertDialogContent className="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>{t(['common', 'visualizations', 'delete-alert-title'])}</AlertDialogTitle>
        <AlertDialogDescription>
          <p>
            {t(['common', 'visualizations', 'delete-alert-description'], {
              values: {
                visualizationType: visualizationType,
                visualizationId: visualizationId,
              },
            })}
          </p>
          <br />
          <p>{t(['common', 'visualizations', 'delete-alert-description-warning'])}</p>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button>{t(['common', 'form', 'cancel'])}</Button>
        </AlertDialogCancel>
        <Button variant="destructive" onClick={onDelete}>
          {t(['common', 'visualizations', 'delete-alert-action'])}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
