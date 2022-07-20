import { ChevronUpIcon } from '@heroicons/react/solid';

import Button from '@/features/ui/Button';

export interface AllotmentHeaderProps {
  title?: string;
  onClick?: () => void;
  open?: boolean;
}

export default function AllotmentHeader(props: AllotmentHeaderProps): JSX.Element {
  const { title, onClick, open } = props;
  return (
    <div className="flex h-7 w-full justify-between bg-intavia-green-100">
      <span>{title}</span>
      <div>
        <button className="h-full bg-transparent">
          <ChevronUpIcon
            onClick={onClick}
            className={`${open === true ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
          />
        </button>
      </div>
    </div>
  );
}

{
  /* <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <span>{title}</span>
              <ChevronUpIcon
                className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="h-full overflow-hidden overflow-y-scroll px-4 pt-4 pb-2 text-sm text-gray-500">
              {children}
            </Disclosure.Panel> */
}
