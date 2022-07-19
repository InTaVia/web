import { Typography } from '@mui/material';

import { useGetProfessionsQuery } from '@/features/common/intavia-api.service';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import { Professions } from '@/features/professions/professions';
import { LeafSizing } from '@/features/professions/professions-svg';
import { Origin } from '@/features/visual-querying/Origin';
import type { ProfessionConstraint } from '@/features/visual-querying/visualQuerying.slice';

interface ProfessionConstraintWidgetProps {
  width: number;
  height: number;
  constraint: ProfessionConstraint;
}

export function ProfessionConstraintWidget(props: ProfessionConstraintWidgetProps): JSX.Element {
  const { width, height, constraint } = props;

  // TODO:mfranke93: This is currently not considering the filters from other
  // constraints, but that *COULD* be considered a feature, not a bug.
  const searchFilters = usePersonsSearchFilters();
  const { data, isLoading } = useGetProfessionsQuery(searchFilters);

  // this is inside the foreignObject: completely new coordinate system
  const origin = new Origin();

  function renderContent(): JSX.Element {
    if (isLoading) {
      return <Typography>Loading ...</Typography>;
    }

    if (data) {
      return (
        <Professions
          width={width}
          height={height}
          constraint={constraint}
          origin={origin}
          leafSizing={LeafSizing.QualitativeWithBar}
          professions={data!}
        />
      );
    }

    return <Typography>No data</Typography>;
  }

  return <div style={{ width: width, height: height }}>{renderContent()}</div>;
}
