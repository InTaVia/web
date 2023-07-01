import { cn, Label, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@intavia/ui';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import type { IntaviaIconTypes } from '@/features/common/icons/intavia-icon';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';

export const getStaticProps = withDictionaries(['common']);

export default function IconsPage(): JSX.Element {
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: 'InTaVia Icons' };

  // const hover = 'hover:fill-[#FFA400] hover:cursor-pointer';

  const size = 'h-6 w-6 cursor-pointer';
  const highlight = 'stroke-[#FFA400] stroke-2';
  const outline = 'fill-none stroke-stone-600';
  const fill = 'fill-stone-600 stroke-stone-600';
  const lightGray = 'fill-stone-300 stroke-stone-500';
  const gray = 'fill-stone-400 stroke-stone-600';

  const entityIcons = [
    {
      type: 'entity-kind',
      kind: 'person',
      label: 'person',
      'fill-light': 'fill-intavia-apple-300',
      'fill-medium': 'fill-intavia-apple-500',
      'fill-dark': 'fill-intavia-apple-700',
      'stroke-light': 'stroke-intavia-apple-300',
      'stroke-medium': 'stroke-intavia-apple-500',
      'stroke-dark': 'stroke-intavia-apple-700',
      'hover-fill': 'hover:fill-intavia-apple-300',
      'hover-stroke': 'hover:stroke-intavia-apple-500',
    },
    {
      type: 'entity-kind',
      kind: 'cultural-heritage-object',
      label: 'cultural object',
      'fill-light': 'fill-intavia-conifer-200',
      'fill-medium': 'fill-intavia-conifer-400',
      'fill-dark': 'fill-intavia-conifer-600',
      'stroke-light': 'stroke-intavia-conifer-200',
      'stroke-medium': 'stroke-intavia-conifer-400',
      'stroke-dark': 'stroke-intavia-conifer-600',
      'hover-fill': 'hover:fill-intavia-conifer-200',
      'hover-stroke': 'hover:stroke-intavia-conifer-400',
    },
    {
      type: 'entity-kind',
      kind: 'group',
      label: 'group / institution',
      'fill-light': 'fill-intavia-tumbleweed-200',
      'fill-medium': 'fill-intavia-tumbleweed-400',
      'fill-dark': 'fill-intavia-tumbleweed-700',
      'stroke-light': 'stroke-intavia-tumbleweed-200',
      'stroke-medium': 'stroke-intavia-tumbleweed-400',
      'stroke-dark': 'stroke-intavia-tumbleweed-700',
      'hover-fill': 'hover:fill-intavia-tumbleweed-200',
      'hover-stroke': 'hover:stroke-intavia-tumbleweed-400',
    },
    {
      type: 'entity-kind',
      kind: 'place',
      label: 'place',
      'fill-light': 'fill-intavia-wistful-200',
      'fill-medium': 'fill-intavia-wistful-400',
      'fill-dark': 'fill-intavia-wistful-700',
      'stroke-light': 'stroke-intavia-wistful-200',
      'stroke-medium': 'stroke-intavia-wistful-400',
      'stroke-dark': 'stroke-intavia-wistful-700',
      'hover-fill': 'hover:fill-intavia-wistful-200',
      'hover-stroke': 'hover:stroke-intavia-wistful-400',
    },
    {
      type: 'event-kind',
      kind: 'event-circle',
      label: 'birth (circle)',
      'fill-light': 'fill-[#EEEEEE]',
      'fill-medium': 'fill-[#EEEEEE]',
      'fill-dark': 'fill-[#EEEEEE]',
      'stroke-light': 'stroke-[#333333]stroke-2',
      'stroke-medium': 'stroke-[#333333] stroke-2',
      'stroke-dark': 'stroke-[#333333] stroke-2',
      'hover-fill': 'hover:fill-[#333333]',
      'hover-stroke': 'hover:stroke-[#EEEEEE]',
    },
    {
      type: 'event-kind',
      kind: 'event-diamond',
      label: 'birth (diamond)',
      'fill-light': 'fill-[#EEEEEE]',
      'fill-medium': 'fill-[#EEEEEE]',
      'fill-dark': 'fill-[#EEEEEE]',
      'stroke-light': 'stroke-[#333333]stroke-2',
      'stroke-medium': 'stroke-[#333333] stroke-2',
      'stroke-dark': 'stroke-[#333333] stroke-2',
      'hover-fill': 'hover:fill-[#333333]',
      'hover-stroke': 'hover:stroke-[#EEEEEE]',
    },
    {
      type: 'event-kind',
      kind: 'event-rectangle',
      label: 'production',
      'fill-light': 'fill-intavia-conifer-200',
      'fill-medium': 'fill-intavia-conifer-400',
      'fill-dark': 'fill-intavia-conifer-600',
      'stroke-light': 'stroke-intavia-conifer-200',
      'stroke-medium': 'stroke-intavia-conifer-400',
      'stroke-dark': 'stroke-intavia-conifer-600',
      'hover-fill': 'hover:fill-intavia-conifer-200',
      'hover-stroke': 'hover:stroke-intavia-conifer-400',
    },
    {
      type: 'event-kind',
      kind: 'event-circle',
      label: 'event (default)',
      'fill-light': 'fill-intavia-apple-300',
      'fill-medium': 'fill-intavia-apple-500',
      'fill-dark': 'fill-intavia-apple-700',
      'stroke-light': 'stroke-intavia-apple-300',
      'stroke-medium': 'stroke-intavia-apple-500',
      'stroke-dark': 'stroke-intavia-apple-700',
      'hover-fill': 'hover:fill-intavia-apple-300',
      'hover-stroke': 'hover:stroke-intavia-apple-500',
    },
    {
      type: 'event-kind',
      kind: 'event-circle',
      label: 'career',
      'fill-light': 'fill-intavia-downy-200',
      'fill-medium': 'fill-intavia-downy-400',
      'fill-dark': 'fill-intavia-downy-600',
      'stroke-light': 'stroke-intavia-downy-200',
      'stroke-medium': 'stroke-intavia-downy-400',
      'stroke-dark': 'stroke-intavia-downy-600',
      'hover-fill': 'hover:fill-intavia-downy-200',
      'hover-stroke': 'hover:stroke-intavia-downy-400',
    },
    {
      type: 'event-kind',
      kind: 'event-circle',
      label: 'movement',
      'fill-light': 'fill-intavia-cornflower-200',
      'fill-medium': 'fill-intavia-cornflower-400',
      'fill-dark': 'fill-intavia-cornflower-600',
      'stroke-light': 'stroke-intavia-cornflower-200',
      'stroke-medium': 'stroke-intavia-cornflower-400',
      'stroke-dark': 'stroke-intavia-cornflower-600',
      'hover-fill': 'hover:fill-intavia-cornflower-200',
      'hover-stroke': 'hover:stroke-intavia-cornflower-400',
    },
    {
      type: 'event-kind',
      kind: 'event-circle',
      label: 'death (circle)',
      'fill-light': 'fill-[#333333]',
      'fill-medium': 'fill-[#333333]',
      'fill-dark': 'fill-[#333333]',
      'stroke-light': 'stroke-[#999999]stroke-2',
      'stroke-medium': 'stroke-[#999999] stroke-2',
      'stroke-dark': 'stroke-[#999999] stroke-2',
      'hover-fill': 'hover:fill-[#EEEEEE]',
      'hover-stroke': 'hover:stroke-[#333333]',
    },
    {
      type: 'event-kind',
      kind: 'event-diamond',
      label: 'death (death)',
      'fill-light': 'fill-[#333333]',
      'fill-medium': 'fill-[#333333]',
      'fill-dark': 'fill-[#333333]',
      'stroke-light': 'stroke-[#999999]stroke-2',
      'stroke-medium': 'stroke-[#999999] stroke-2',
      'stroke-dark': 'stroke-[#999999] stroke-2',
      'hover-fill': 'hover:fill-[#EEEEEE]',
      'hover-stroke': 'hover:stroke-[#333333]',
    },
  ];

  const iconTypes = [
    {
      label: 'outline',
      className: (icon: any) => {
        return cn(size, outline);
      },
      seperator: false,
    },
    {
      label: 'fill',
      className: (icon: any) => {
        return cn(size, fill);
      },
      seperator: true,
    },
    {
      label: 'default color',
      className: (icon: any) => {
        return cn(
          size,
          icon['fill-medium'],
          icon['stroke-dark'],
          icon['hover-fill'],
          icon['hover-stroke'],
        );
      },
      seperator: true,
    },
    {
      label: 'de-emphasized light',
      className: (icon: any) => {
        return cn(size, lightGray, icon['hover-fill'], icon['hover-stroke']);
      },
      seperator: false,
    },
    {
      label: 'de-emphasized dark',
      className: (icon: any) => {
        return cn(size, gray, icon['hover-fill'], icon['hover-stroke']);
      },
      seperator: true,
    },
    {
      label: 'selected light',
      className: (icon: any) => {
        return cn(
          size,
          icon['fill-light'],
          icon['stroke-dark'],
          icon['hover-fill'],
          icon['hover-stroke'],
          'stroke-2',
        );
      },
      seperator: false,
    },
    {
      label: 'selected medium',
      className: (icon: any) => {
        return cn(
          size,
          icon['fill-medium'],
          icon['stroke-dark'],
          icon['hover-fill'],
          icon['hover-stroke'],
          'stroke-2',
        );
      },
      seperator: false,
    },
    {
      label: 'selected dark',
      className: (icon: any) => {
        return cn(
          size,
          icon['fill-dark'],
          icon['stroke-medium'],
          icon['hover-fill'],
          icon['hover-stroke'],
          'stroke-2',
        );
      },
      seperator: false,
    },
    {
      label: 'selected yellow',
      className: (icon: any) => {
        return cn(size, icon['fill-medium'], icon['hover-fill'], highlight);
      },
      seperator: true,
    },
  ];
  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main className="flex flex-col gap-y-4 p-5">
        <h1>{metadata.title}</h1>
        <TooltipProvider>
          {entityIcons.map((icon) => {
            return (
              <div key={`${icon.type}-${icon.kind}`} className="flex flex-row items-center gap-x-2">
                {iconTypes.map((iconType) => {
                  return (
                    <Fragment key={`${icon.type}-${icon.kind}-${iconType.label}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IntaviaIcon
                            icon={icon.kind as IntaviaIconTypes}
                            className={iconType.className(icon)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{iconType.label}</p>
                        </TooltipContent>
                      </Tooltip>
                      {iconType.seperator && <div>|</div>}
                    </Fragment>
                  );
                })}

                <Label className="text-sm">
                  <span className="font-thin">{icon.type} </span>
                  {icon.label}
                </Label>
              </div>
            );
          })}
        </TooltipProvider>
      </main>
    </Fragment>
  );
}
