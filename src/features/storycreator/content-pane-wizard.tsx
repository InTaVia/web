import { useState } from 'react';

import Button from '@/features/ui/Button';

interface ContentPaneWizardProps {
  mini?: boolean;
  onContentAddPerClick?: (type: string) => void;
}

export default function ContentPaneWizard(props: ContentPaneWizardProps): JSX.Element {
  const { mini = false, onContentAddPerClick } = props;

  const [open, setOpen] = useState(mini);

  function onButtonClick(type: string) {
    if (onContentAddPerClick !== undefined) {
      onContentAddPerClick(type);
    }
    setOpen(false);
  }

  let content;

  if (!open && mini) {
    content = (
      <Button
        round="round"
        color="accent"
        onClick={() => {
          setOpen(!open);
        }}
      >
        +
      </Button>
    );
  } else {
    content = (
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-white p-4">
        <Button
          round="round"
          color="accent"
          onClick={() => {
            onButtonClick('Text');
          }}
        >
          Text
        </Button>
        <Button
          round="round"
          color="accent"
          onClick={() => {
            onButtonClick('Image');
          }}
        >
          Image
        </Button>
        <Button
          round="round"
          color="accent"
          onClick={() => {
            onButtonClick('Quiz');
          }}
        >
          Quiz
        </Button>
      </div>
    );
  }

  return <div className="flex items-center justify-center p-5">{content}</div>;
}
