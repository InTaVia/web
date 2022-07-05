import type { ReactNode } from 'react';

export interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props;

  // placeholder links while navbar is not finished
  const pages: Array<[string, string]> = [
    ['Home', '/'],
    ['VAS', '/visual-analytics-studio'],
    ['Search', '/search'],
    ['Collections', '/collections'],
    ['Coordination', '/coordination'],
    ['Professions', '/professions'],
    ['Search', '/search'],
    ['Timeline', '/timeline'],
    ['Visual querying', '/visual-querying'],
  ];

  return (
    <div className="grid grid-rows-[auto_1fr] bg-gray-50 min-h-full">
      <header className="flex gap-2">
        <h1 className="font-bold mr-4">AppBar</h1>
        {pages.map(([title, link]) => {
          return (
            <a href={link} key={title} className="text-blue-800 underline">
              {title}
            </a>
          );
        })}
      </header>
      <main>{children}</main>
    </div>
  );
}
