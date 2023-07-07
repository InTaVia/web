import { ChevronUpIcon } from '@heroicons/react/solid';

export interface AllotmentHeaderProps {
  title?: string;
  onClick?: () => void;
  open?: boolean;
}

export default function AllotmentHeader(props: AllotmentHeaderProps): JSX.Element {
  const { title, onClick, open } = props;
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      onClick={onClick}
      className="flex h-6 w-full cursor-pointer items-center justify-between border-b bg-neutral-100 p-2 text-neutral-700"
    >
      <div>{title}</div>
      <div className="flex">
        <button className="h-full bg-transparent">
          <ChevronUpIcon
            className={`${open === true ? 'rotate-180' : ''} h-5 w-5 text-neutral-700`}
          />
        </button>
      </div>
    </div>
  );
}
