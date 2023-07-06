import { useCallback, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';

interface EditableTextProps {
  content: string;
  setContent: (newContent: string) => void;
  dataPlaceholder?: string;
}

export function EditableText(props: EditableTextProps) {
  const { content, setContent, dataPlaceholder = 'Edit me' } = props;

  /* const [grayed, setGrayed] = useState(i_grayed); */

  const onContentChange = useCallback(
    (evt) => {
      const sanitizeConf = {
        allowedTags: ['b', 'i', 'a', 'p'],
        allowedAttributes: { a: ['href'] },
      };

      setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
    },
    [setContent],
  );

  return (
    <ContentEditable
      onChange={(event) => {
        /*   if (event.target.value === '') {
          setGrayed(true);
        } else {
          setGrayed(false);
        } */
      }}
      className="editableWithPlaceholder"
      placeholder={dataPlaceholder}
      onBlur={onContentChange}
      /* className={`${grayed === true ? 'text-slate-300' : ''}`} */
      html={content}
    />
  );
}
