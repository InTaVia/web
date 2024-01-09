import 'react-image-gallery/styles/css/image-gallery.css';

import type { MediaResource } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';
import ImageGallery from 'react-image-gallery';

import { useMediaResources } from '@/features/media/use-media-resources';
import { unique } from '@/lib/unique';

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
        //FIXME: Temp fix to load mixed media resources in gallery (mainly applies to wikimedia urls; experimental might not work for other urls)
        return { original: mediaResource!.url.replace('http://', 'https://') };
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

    const mediaKindsUnique = unique(
      mediaResourceIds.map((mediaResourceId) => {
        const mediaResource = data.get(mediaResourceId);
        return mediaResource!.kind;
      }),
    );
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200">
        <p className="text-neutral-600">
          {`Sorry, the following media type${
            mediaKindsUnique.length > 1 ? 's are' : ' is'
          } not yet supported: '${mediaKindsUnique.join(', ')}'`}
        </p>
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
