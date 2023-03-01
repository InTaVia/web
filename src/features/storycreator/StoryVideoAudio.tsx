import { useMemo } from 'react';
import ReactPlayer from 'react-player';

import type { StoryVideoAudio } from '@/features/storycreator/contentPane.slice';

export interface StoryVideoAudioProps {
  content: StoryVideoAudio;
}

export function StoryVideoAudio(props: StoryVideoAudioProps): JSX.Element {
  const { content } = props;

  const url = useMemo(() => {
    let url = content.properties.link?.value;

    const startNumber = content.properties.start?.value ?? 0;
    if (startNumber > 0) {
      url = url + `#t=${startNumber}`;
    }

    return url;
  }, [content]);

  return (
    <div className="flex h-full max-h-full justify-center bg-white p-2">
      {url !== '' && <ReactPlayer width="100%" height="100%" controls url={url} />}
    </div>
  );
}
