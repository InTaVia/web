import { Button, Label } from '@intavia/ui';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { GroupSvgGroup, PersonSvgGroup } from '@/features/common/icons/intavia-icon-shapes';

export const getStaticProps = withDictionaries(['common']);

export default function IconsPage(): JSX.Element {
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: 'InTaVia Icons' };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main className="flex flex-col gap-y-4 p-5">
        <h1>{metadata.title}</h1>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="person" className="h-8 w-8 fill-lime-200 stroke-lime-800" />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>person
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="cultural-heritage-object"
            className="h-8 w-8 fill-sky-200 stroke-sky-800"
          />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>cultural-heritage-object
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="group" className="h-8 w-8 fill-stone-200 stroke-stone-800" />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>group / institution
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="historical-event"
            className="h-8 w-8 fill-yellow-200 stroke-yellow-800"
          />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>historical-event
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="place" className="h-8 w-8 fill-red-200 stroke-red-800" />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>place
          </Label>
        </div>

        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="collection" className="h-8 w-8 fill-indigo-200 stroke-indigo-800" />
          <Label className="text-sm">
            <span className="font-thin">ui </span>collection
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="timeline" className="h-10 w-10 fill-none stroke-slate-400" />
          <Label className="text-sm">
            <span className="font-thin">vis </span>timeline
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="map" className="h-10 w-10 fill-none stroke-slate-400" />
          <Label className="text-sm">
            <span className="font-thin">vis </span>map
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="network" className="h-10 w-10 fill-none stroke-slate-400" />
          <Label className="text-sm">
            <span className="font-thin">vis </span>network
          </Label>
        </div>

        <Button className="max-w-fit fill-intavia-green-200">
          <IntaviaIcon icon="map" className="fill-none stroke-slate-100" />
          <Label>Create Map</Label>
        </Button>
        <svg width={800} height={400}>
          <rect width="100%" height="100%" className="fill-stone-300" />
          <GroupSvgGroup />
          <PersonSvgGroup transform="translate(100 45.5)" fill="red" />
        </svg>
      </main>
    </Fragment>
  );
}
