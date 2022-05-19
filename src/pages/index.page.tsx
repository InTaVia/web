import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { PageTitle } from '@/features/ui/page-title';

export default function HomePage(): JSX.Element {
  const metadata = { title: 'Home' };

  const titleTemplate = usePageTitleTemplate();

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <PageTitle>Welcome to InTaVia!</PageTitle>
    </Fragment>
  );
}
