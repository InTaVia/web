import { useMemo } from 'react';
import ReactPlayer from 'react-player';

import type { StoryVideoAudio } from '@/features/storycreator/contentPane.slice';

export interface StoryVideoAudioProps {
  content: StoryVideoAudio;
  fontFamily?: string;
}

export function StoryVideoAudio(props: StoryVideoAudioProps): JSX.Element {
  const { content, fontFamily } = props;

  const { title, text, url } = useMemo(() => {
    let url = content.properties.link?.value;
    const title = content.properties.title?.value;
    const text = content.properties.caption?.value;

    const startNumber = content.properties.start?.value ?? 0;
    if (startNumber > 0) {
      url = url + `#t=${startNumber}`;
    }

    return { title, text, url };
  }, [content]);

  return (
    <div className="flex h-full max-h-full justify-center bg-white p-2" style={{ fontFamily }}>
      {url !== '' && <ReactPlayer width="100%" height="100%" controls url={url} />}
      {(title !== '' || text !== '') && (
        <div className="absolute bottom-0 w-full bg-white p-2">
          {title !== '' && <p className="mb-1 text-xl">{title}</p>}
          {text !== '' && <p>{text}</p>}
        </div>
      )}
    </div>
  );
}
