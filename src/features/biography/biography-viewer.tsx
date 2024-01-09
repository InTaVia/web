import type { Biography } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';
import parse from 'html-react-parser';
import { useId } from 'react';

import { useBiographies } from '@/features/biography/use-biographies';

interface BiographyViewerProps {
  biographyIds: Array<Biography['id']>;
}

export function BiographyViewer(props: BiographyViewerProps): JSX.Element {
  const { biographyIds } = props;

  const { data, status } = useBiographies(biographyIds);
  const id = useId();
  if (status === 'success') {
    return (
      <div>
        <h2 className="pb-1 font-bold uppercase text-neutral-700">Biography</h2>
        <div className="flex flex-col gap-4 divide-y">
          {biographyIds.map((biographyId, index) => {
            const biography = data.get(biographyId);

            if (biography == null) return;

            return (
              <div key={`bio-${biographyId}-${id}`} className={index > 0 ? 'pt-4' : 'pt-0'}>
                <p className={'font-bold'}>{biography.title != null && biography.title}</p>
                <p className={'text-sm font-light'}>
                  {biography.abstract != null && biography.abstract}
                </p>
                {Boolean(biography.text) && (
                  //<div>{parse(element!.properties!.text!.value)}</div>
                  <p className={'whitespace-pre-line'}>{parse(biography.text)}</p>
                )}
                <p className={'text-xs font-light'}>
                  {biography.citation != null && `Citation: ${biography.citation}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-neutral-50">
      <LoadingIndicator />
      <p>Loading biography</p>
    </div>
  );
}
