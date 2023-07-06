import 'react-image-gallery/styles/css/image-gallery.css';

import type { MediaResource } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';
import ImageGallery from 'react-image-gallery';

import { useMediaResources } from '@/features/media/use-media-resources';

interface MediaViewerProps {
  mediaResourceIds: Array<MediaResource['id']>;
}

export function MediaViewer(props: MediaViewerProps): JSX.Element {
  const { mediaResourceIds } = props;
  const { data, status } = useMediaResources(mediaResourceIds);

  if (status === 'success') {
    const images = mediaResourceIds
      .filter((mediaResourceId) => {
        const mediaResource = data.get(mediaResourceId);
        return mediaResource!.kind === 'image';
      })
      .map((mediaResourceId) => {
        const mediaResource = data.get(mediaResourceId);
        return { original: mediaResource!.url };
      });

    if (images.length > 0) {
      return (
        <div>
          <ImageGallery
            items={images}
            useBrowserFullscreen={false}
            showPlayButton={false}
            showIndex={true}
          />
        </div>
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200">
        <p className="text-neutral-600">Sorry, this media type is not yet supported :(</p>
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
