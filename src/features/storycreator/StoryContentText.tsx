import { useAppDispatch, useAppSelector } from '@/app/store';
import type { SlideContent } from '@/features/storycreator/contentPane.slice';
import {
  editSlideContentProperty,
  selectContentByID,
} from '@/features/storycreator/contentPane.slice';
import { EditableText } from '@/features/ui/editable-text';

interface StoryContentTextProps {
  i_content: SlideContent;
}

export function StoryContentText(props: StoryContentTextProps) {
  const { i_content } = props;

  const dispatch = useAppDispatch();

  const content = useAppSelector((state) => {
    return selectContentByID(state, i_content.parentPane, i_content.id);
  });

  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          height: '100%',
          maxHeight: '100%',
          position: 'relative',
          backgroundColor: 'white',
          padding: 0,
          //fontFamily: fontFamily,
        }}
      >
        <div className="p-2">
          <p className={`mb-1 text-xl`}>
            <EditableText
              key={`${content.properties.id}Editable`}
              content={content!.properties!.title!.value}
              dataPlaceholder={'Title'}
              setContent={(text) => {
                dispatch(
                  editSlideContentProperty({
                    content: { ...content },
                    property: 'title',
                    value: text === 'Title' ? '' : text,
                  }),
                );
              }}
            />
          </p>
          <p>
            <EditableText
              key={`${content.properties.id}Editable`}
              content={content!.properties!.text!.value}
              dataPlaceholder={'Text'}
              setContent={(text) => {
                dispatch(
                  editSlideContentProperty({
                    content: content,
                    property: 'text',
                    value: text === 'Text' ? '' : text,
                  }),
                );
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
