import type { Entity } from '@intavia/api-client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@intavia/ui';
import { AlertTriangleIcon, CheckIcon, ChevronsRightIcon } from 'lucide-react';

interface EntityQualityIndicatorProps {
  entity: Entity;
}

export function EntityQualityIndicator(props: EntityQualityIndicatorProps): JSX.Element {
  const { entity } = props;

  const relationsCount = entity.relations.length;
  const relationLevel =
    relationsCount >= 10
      ? 'high'
      : relationsCount >= 3 && relationsCount < 10
      ? 'medium'
      : relationsCount >= 1 && relationsCount < 3
      ? 'low'
      : 'no';

  const relationsScale = {
    no: {
      icon: <span className="font-semibold group-hover:text-[#d7191c]">{relationsCount}</span>,
      text: 'events',
    },
    low: {
      icon: <span className="font-semibold group-hover:text-[#fdae61]">{relationsCount}</span>,
      text: relationsCount === 1 ? 'event' : 'events',
    },
    medium: {
      icon: <span className="font-semibold group-hover:text-[#a6d96a]">{relationsCount}</span>,
      text: 'events',
    },
    high: {
      icon: <span className="font-semibold group-hover:text-[#1a9641]">{relationsCount}</span>,
      text: 'events',
    },
  };

  const linkedIdsCount =
    entity.linkedIds != null && entity.linkedIds.length > 0 ? entity.linkedIds.length : 0;

  const hasMedia = entity.media != null && entity.media.length > 0 ? true : false;
  const hasBiography = entity.biographies != null && entity.biographies.length > 0 ? true : false;
  const hasBackendErrors = entity.errors != null && entity.errors.length > 0 ? true : false;

  return (
    <div className="flex flex-row gap-x-2 text-neutral-400 group-hover:text-neutral-500">
      <ChevronsRightIcon className="h-4 w-4" />
      <div className="flex flex-row gap-x-1 align-middle">
        {relationsScale[relationLevel].icon}
        <span>{relationsScale[relationLevel].text}</span>
      </div>
      {linkedIdsCount > 0 && (
        <div className="flex flex-row gap-x-1 align-middle ">
          <CheckIcon className="h-4 w-4 shrink-0 group-hover:text-[#1a9641]" />
          <span className="whitespace-nowrap">linked ids</span>
        </div>
      )}
      {hasMedia && (
        <div className="flex flex-row gap-x-1 align-middle ">
          <CheckIcon className="h-4 w-4 shrink-0 group-hover:text-[#1a9641]" />
          <span>media</span>
        </div>
      )}
      {hasBiography && (
        <div className="flex flex-row gap-x-1 align-middle ">
          <CheckIcon className="h-4 w-4 shrink-0 group-hover:text-[#1a9641]" />
          <span>biography</span>
        </div>
      )}
      {hasBackendErrors && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex flex-row gap-x-1 align-middle">
                <AlertTriangleIcon className="h-4 w-4 shrink-0 group-hover:text-[#d7191c]" />
                <span>backend error</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {entity.errors.map((error) => {
                return <p>{error}</p>;
              })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export function NoDateQualityIndicator(): JSX.Element {
  return (
    <div className="flex flex-row gap-x-1 align-middle">
      <AlertTriangleIcon className="h-4 w-4 shrink-0 text-[#d7191c]" />
      <span>no date</span>
    </div>
  );
}
