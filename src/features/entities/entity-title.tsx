import { type Entity } from '@intavia/api-client';
import { Button, cn, Dialog, IconButton, useToast } from '@intavia/ui';
import { Edit2Icon, PlusIcon, Share2Icon } from 'lucide-react';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppSelector } from '@/app/store';
import { selectLocalEntities } from '@/app/store/intavia.slice';
import { EditEntityDialog } from '@/components/search/edit-entity-dialog';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { getEntityKindPropertiesByKind } from '@/features/common/visualization.config';
import { AddToCollectionDialog } from '@/features/entities/add-to-collection-dialog';

interface EntityTitleProps {
  entity: Entity;
}

export function EntityTitle(props: EntityTitleProps): JSX.Element {
  const { entity } = props;

  const { t } = useI18n<'common'>();

  const localEntities = useAppSelector(selectLocalEntities);
  const isLocalEntity = entity.id in localEntities;

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isAddToCollectionDialogOpen, setAddToCollectionDialogOpen] = useState(false);

  const { toast } = useToast();

  function onCopyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        // Success
        toast({
          title: 'Copied URL to clipboard',
          variant: 'default',
        });
      },
      () => {
        toast({
          title: 'Error',
          description: 'Copying URL to clipboard not possible',
          variant: 'destructive',
        });
      },
    );
  }

  // TODO: Clicking the share button should open some kind of share dialog
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IntaviaIcon
            icon={entity.kind}
            className={cn(
              'h-16 w-16 shrink-0',
              getEntityKindPropertiesByKind(entity.kind).iconStyle,
            )}
            strokeWidth={1.5}
          />
          <div>
            <h1 className="flex items-center gap-4 text-4xl font-extrabold">
              <span>{entity.label.default}</span>
            </h1>
            <p className="text-neutral-400">
              {t(['common', 'entity', 'kinds', entity.kind, 'one'])}
              {isLocalEntity ? <span> - edited locally</span> : null}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setAddToCollectionDialogOpen(true);
            }}
            title={t(['common', 'search', 'add-to-collection'])}
          >
            <PlusIcon className="h-5 w-5 shrink-0" />
            {t(['common', 'search', 'add-to-collection'])}
          </Button>
          <IconButton
            variant="outline"
            label="t(['common', 'search', 'edit-item'])"
            onClick={() => {
              setEditDialogOpen(true);
            }}
            title={t(['common', 'search', 'edit-item'])}
          >
            <Edit2Icon className="h-5 w-5 shrink-0" />
          </IconButton>
          {!isLocalEntity && (
            <IconButton variant="outline" label="Share" onClick={onCopyUrl}>
              <Share2Icon className="h-5 w-5 shrink-0" />
            </IconButton>
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditEntityDialog
          entity={entity}
          onClose={() => {
            setEditDialogOpen(false);
          }}
        />
      </Dialog>

      <Dialog open={isAddToCollectionDialogOpen} onOpenChange={setAddToCollectionDialogOpen}>
        <AddToCollectionDialog
          entity={entity}
          onClose={() => {
            setAddToCollectionDialogOpen(false);
          }}
        />
      </Dialog>
    </>
  );
}
