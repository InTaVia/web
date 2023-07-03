import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useParams } from '@/app/route/use-params';
import { EntityEditScreen } from '@/features/entities/entity-edit-screen';

export const getServerSideProps = withDictionaries(['common']);

export default function EntityEditPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();
  const params = useParams();
  const id = params?.get('id');

  const metadata = { title: t(['common', 'entity-edit', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      {id != null ? <EntityEditScreen id={id} /> : null}
    </Fragment>
  );
}
