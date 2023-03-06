import { useRef } from 'react';
import ContentEditable from 'react-contenteditable';

import { useAppDispatch } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import type { SlideContent, StoryTitle } from '@/features/storycreator/contentPane.slice';

interface StoryTitleSlideProps {
  element: StoryTitle;
  editable?: boolean;
  handleSaveComponent: (element: SlideContent | Visualization) => void;
}

export function StoryTitleSlide(props: StoryTitleSlideProps) {
  const { element, editable, handleSaveComponent } = props;

  const dispatch = useAppDispatch();

  const content = function onChange(property: string, newValue: unknown) {
    const newProperties = { ...element.properties };
    const changedProperty = { ...newProperties[property], value: newValue };
    const newElement = {
      ...element,
      properties: { ...newProperties, [property]: changedProperty },
    };
    handleSaveComponent(newElement as SlideContent);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="p-2">
        <ContentEditable
          innerRef={useRef()}
          html={element.properties.title?.value} // innerHTML of the editable div
          disabled={false} // use true to disable editing
          onBlur={(e) => {
            onChange('title', e.target.innerHTML);
          }} // handle innerHTML change
          tagName="p" // Use a custom HTML tag (uses a div by default)
          className="mb-1 text-xl"
        />
        <ContentEditable
          innerRef={useRef()}
          html={element.properties.subtitle?.value} // innerHTML of the editable div
          disabled={false} // use true to disable editing
          onBlur={(e) => {
            onChange('subtitle', e.target.innerHTML);
          }} // handle innerHTML change
          tagName="p" // Use a custom HTML tag (uses a div by default)
        />
      </div>
    </div>
  );
}
