import { Button, cn, Label } from '@intavia/ui';
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

  const hover = 'hover:fill-[#FFA400] hover:cursor-pointer';

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main className="flex flex-col gap-y-4 p-5">
        <h1>{metadata.title}</h1>
        <h2>Entities</h2>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="person" className={cn('h-8 w-8 fill-none stroke-stone-900', hover)} />
          <IntaviaIcon icon="person" className={cn('h-8 w-8 fill-stone-900 stroke-none', hover)} />
          <IntaviaIcon
            icon="person"
            className={cn('h-8 w-8 fill-stone-400 stroke-stone-500 hover:stroke-stone-600', hover)}
          />
          <IntaviaIcon
            icon="person"
            className={cn(
              'h-8 w-8 fill-intavia-highland-400 stroke-intavia-highland-500 hover:stroke-intavia-highland-600',
              hover,
            )}
          />
          <IntaviaIcon
            icon="person"
            className={cn('h-8 w-8 fill-intavia-highland-400 stroke-stone-800', hover)}
          />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>person
          </Label>
        </div>

        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="cultural-heritage-object"
            className="h-8 w-8 fill-none stroke-stone-900"
          />
          <IntaviaIcon
            icon="cultural-heritage-object"
            className="h-8 w-8 fill-stone-900 stroke-none"
          />
          <IntaviaIcon
            icon="cultural-heritage-object"
            className="h-8 w-8 fill-stone-400 stroke-stone-500"
          />
          <IntaviaIcon
            icon="cultural-heritage-object"
            className="h-8 w-8 fill-intavia-sulu-400 stroke-intavia-sulu-500"
          />
          <IntaviaIcon
            icon="cultural-heritage-object"
            className="h-8 w-8 fill-intavia-sulu-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>cultural-heritage-object
          </Label>
        </div>

        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="group" className="h-8 w-8 fill-none stroke-stone-900" />
          <IntaviaIcon icon="group" className="h-8 w-8 fill-stone-900 stroke-none" />
          <IntaviaIcon icon="group" className="h-8 w-8 fill-stone-400 stroke-stone-500" />
          <IntaviaIcon
            icon="group"
            className="h-8 w-8 fill-intavia-tumbleweed-400 stroke-intavia-tumbleweed-500"
          />
          <IntaviaIcon
            icon="group"
            className="h-8 w-8 fill-intavia-tumbleweed-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>group / institution
          </Label>
        </div>

        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon icon="place" className="h-8 w-8 fill-none stroke-stone-900" />
          <IntaviaIcon icon="place" className="h-8 w-8 fill-stone-900 stroke-none" />
          <IntaviaIcon icon="place" className="h-8 w-8 fill-stone-400 stroke-stone-500" />
          <IntaviaIcon
            icon="place"
            className="h-8 w-8 fill-intavia-place-400 stroke-intavia-place-500"
          />
          <IntaviaIcon icon="place" className="h-8 w-8 fill-intavia-place-400 stroke-stone-800" />
          <Label className="text-sm">
            <span className="font-thin">entity-kind </span>place
          </Label>
        </div>
        <h2>Events</h2>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-salmon-400 stroke-intavia-salmon-500"
          />
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-salmon-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">event-kind </span>birth
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-highland-400 stroke-intavia-highland-500"
          />
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-highland-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">event-kind </span>event (default)
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="event-rect"
            className="h-8 w-8 fill-intavia-sulu-400 stroke-intavia-sulu-500"
          />
          <IntaviaIcon
            icon="event-rect"
            className="h-8 w-8 fill-intavia-sulu-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">event-kind </span>production
          </Label>
        </div>

        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-bermuda-400 stroke-intavia-bermuda-500"
          />
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-bermuda-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">event-kind </span>career
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-silver-tree-400 stroke-intavia-silver-tree-500"
          />
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-silver-tree-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">event-kind </span>honour
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-cornflower-blue-400 stroke-intavia-cornflower-blue-500"
          />
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-cornflower-blue-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">event-kind </span>movement
          </Label>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-gray-400 stroke-intavia-gray-500"
          />
          <IntaviaIcon
            icon="event-circle"
            className="h-8 w-8 fill-intavia-gray-400 stroke-stone-800"
          />
          <Label className="text-sm">
            <span className="font-thin">event-kind </span>death
          </Label>
        </div>
        {/* <div className="flex flex-row items-center gap-x-2">
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
        </svg> */}
      </main>
    </Fragment>
  );
}
