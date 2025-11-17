import { XCircleIcon } from '@heroicons/react/outline';
import { Button } from '@intavia/ui';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppDispatch } from '@/app/store';
import { clear as clearState } from '@/app/store/intavia.slice';
import { clear as clearCollections } from '@/app/store/intavia-collections.slice';
import { DataImport } from '@/features/data-import/data-import';
import { ProjectExport } from '@/features/data-import/project-export';
import { ProjectImport } from '@/features/data-import/project-import';

export const getStaticProps = withDictionaries(['common']);

export default function IOPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();
  const metadata = { title: t(['common', 'io', 'metadata', 'title']) };
  const dispatch = useAppDispatch();
  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <section className="my-10 grid h-full w-full grid-cols-2 items-center justify-center gap-x-10 p-10">
          <div className="dark:border-neutral-700 dark:bg-neutral-800 flex h-full w-full flex-col flex-nowrap rounded-lg border border-neutral-200 bg-white shadow-md">
            <div className="flex place-content-center items-center gap-2 pt-3 text-intavia-green-900">
              Local Data Import
            </div>
            <div className="dark:text-neutral-400 flex h-full flex-col gap-y-2 px-5 py-2 text-justify font-normal text-neutral-700">
              <DataImport />
            </div>
            <div className="items-left flex w-full flex-col place-content-end gap-2 rounded-b-lg bg-green-50 px-5 py-3 text-green-900">
              <span className="font-medium">Note:</span> Any local data you add here will remain
              local in your browser (local storage) and will not be uploaded or published to any
              servers. You keep full control over your personal or institution's data.
            </div>
          </div>

          <div className="dark:border-neutral-700 dark:bg-neutral-800 flex h-full flex-col flex-nowrap rounded-lg border border-neutral-200 bg-white shadow-md">
            <div className="flex place-content-center items-center gap-2 pt-3 text-intavia-green-900">
              InTaVia Project File Export/Import
            </div>
            <div className="dark:text-neutral-400 flex h-full flex-col gap-y-2 px-5 py-2 text-justify font-normal text-neutral-700">
              <p>
                Exporting an InTavia project file allows you to perserve the current state of the
                application and import it later on to continue working on the project. You can also
                share a project file with your colleauges, which then can also open the project on
                their computers.
              </p>
              <ProjectExport />
              <ProjectImport />
            </div>
            <div className="items-left flex w-full flex-col place-content-end gap-2 rounded-b-lg border-red-800 bg-red-100 p-2 px-5 py-3 text-red-800">
              <span className="font-medium">Disclaimer:</span> When importing an InTaVia project
              file the current application state gets lost! All data, collections, visualizations,
              and stories will be replaced. If you do want to continue working with the current
              project (application state) please export the project before importing an other
              project.
            </div>
          </div>

          <div className="dark:border-neutral-700 dark:bg-neutral-800 col-span-2 flex h-fit w-full flex-col flex-nowrap rounded-lg border border-neutral-200 p-2 shadow-md">
            <p className="font-bold text-red-800">Delete all local data.</p>
            Delete local storage and reset the application.
            <Button
              className="mt-2 w-fit bg-red-100 text-red-800 hover:bg-red-800 hover:text-white"
              type="button"
              onClick={() => {
                dispatch(clearState());
                dispatch(clearCollections());
              }}
            >
              <XCircleIcon className="h-5 w-5" />
              Delete Storage
            </Button>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
