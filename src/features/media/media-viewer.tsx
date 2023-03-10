import type { MediaResource } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';
import { useId } from 'react';

import { useMediaResources } from '@/features/media/use-media-resources';

interface MediaViewerProps {
  mediaResourceIds: Array<MediaResource['id']>;
}

export function MediaViewer(props: MediaViewerProps): JSX.Element {
  const { mediaResourceIds } = props;

  const { data, status } = useMediaResources(mediaResourceIds);

  const id = useId();
  if (status === 'success') {
    return (
      <div>
        <p>Media</p>
        <div>
          {mediaResourceIds.map((mediaResourceId) => {
            const mediaResource = data.get(mediaResourceId);
            return <img key={id} src={mediaResource!.url} alt={id} className="h-96" />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-neutral-50">
      <LoadingIndicator />
      <p>Loading media</p>
    </div>
  );
}
