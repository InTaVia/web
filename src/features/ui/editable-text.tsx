import { useCallback, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';

interface EditableTextProps {
  content: string;
  setContent: (newContent: string) => void;
}

export function EditableText(props: EditableTextProps) {
  const { content, setContent } = props;

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

  return <ContentEditable onChange={() => {}} onBlur={onContentChange} html={content} />;
}
