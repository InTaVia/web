import type { Biography } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';
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
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-700">Biography</p>
        {biographyIds.map((biographyId) => {
          const biography = data.get(biographyId);

          if (biography == null) return;

          return (
            <div key={`bio-${biographyId}-${id}`}>
              <p className={'text-sm italic'}>{biography.abstract != null && biography.abstract}</p>
              <p className={'whitespace-pre-line'}>{biography.text != null && biography.text}</p>
            </div>
          );
        })}
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
