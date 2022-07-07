import { Paper } from '@mui/material';

import { useGetProfessionsQuery } from '@/features/common/intavia-api.service';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import { Professions } from '@/features/professions/professions';
import { LeafSizing } from '@/features/professions/professions-svg';
import { Origin } from '@/features/visual-querying/Origin';
import type { ProfessionConstraint } from '@/features/visual-querying/visualQuerying.slice';

interface ProfessionConstraintWidgetProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: ProfessionConstraint;
  origin: Origin;
}

export function ProfessionConstraintWidget(props: ProfessionConstraintWidgetProps): JSX.Element {
  const { x, y, width, height, constraint } = props;

  // TODO:mfranke93: This is currently not considering the filters from other
  // constraints, but that *COULD* be considered a feature, not a bug.
  const searchFilters = usePersonsSearchFilters();
  const { data, isLoading } = useGetProfessionsQuery(searchFilters);

  // this is inside the foreignObject: completely new coordinate system
  const origin = new Origin();

  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <Paper
        elevation={3}
        sx={{
          margin: '2px',
          width: width - 4,
          height: height - 4,
          display: 'grid',
        }}
      >
        {!isLoading && (
          <Professions
            constraint={constraint}
            origin={origin}
            leafSizing={LeafSizing.QualitativeWithBar}
            professions={data!}
          />
        )}
      </Paper>
    </foreignObject>
  );
}
