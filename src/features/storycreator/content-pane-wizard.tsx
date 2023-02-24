import { useState } from 'react';

import { SlideContentTypes } from '@/features/storycreator/contentPane.slice';
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
      <div className="grid w-full grid-cols-3 gap-2 rounded-lg bg-white p-4">
        {SlideContentTypes.map((type) => {
          return (
            <Button
              key={`${type}ContentButton`}
              round="round"
              color="accent"
              onClick={() => {
                onButtonClick(type);
              }}
            >
              {type}
            </Button>
          );
        })}
      </div>
    );
  }

  return <div className="flex w-full items-center justify-center p-5">{content}</div>;
}
