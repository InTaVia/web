import { LoadingIndicator } from '@intavia/ui';

import {
  useSearchBirthStatisticsQuery,
  useSearchDeathStatisticsQuery,
} from '@/api/intavia.service';
import { useAppDispatch } from '@/app/store';
import type {
  PersonBirthDateConstraint,
  PersonDeathDateConstraint,
} from '@/features/visual-querying/constraints.types';
import { setConstraintValue } from '@/features/visual-querying/visualQuerying.slice';
import { Histogram } from '@/features/visualizations/Histogram';

interface DateConstraintWidgetProps {
  width: number;
  height: number;
  constraint: PersonBirthDateConstraint | PersonDeathDateConstraint;
}

export function DateConstraintWidget(props: DateConstraintWidgetProps): JSX.Element {
  const { width, height, constraint } = props;
  const dispatch = useAppDispatch();

  const { data, isLoading } =
    constraint.id === 'person-birth-date'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useSearchBirthStatisticsQuery({ bins: 1600 })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useSearchDeathStatisticsQuery({ bins: 1600 });

  const dimensions = {
    x: 0,
    y: 0,
    marginTop: height - 32,
    marginLeft: 50,
    width: width,
    height: height,
    boundedWidth: width - 50,
    boundedHeight: height - 100,
  };

  function setBrushedArea(area: [number, number]) {
    dispatch(
      setConstraintValue({
        id: constraint.id,
        value: area,
      }),
    );
  }

  function renderContent(): JSX.Element {
    if (isLoading) {
      return (
        <div className="grid h-full w-full place-items-center">
          <LoadingIndicator />
        </div>
      );
    }

    if (data) {
      return (
        <Histogram
          rawData={data.bins}
          initialBrushedArea={constraint.value}
          onChangeBrushedArea={setBrushedArea}
        />
      );
    }

    return (
      <div className="grid h-full w-full place-items-center">
        <p>No data</p>
      </div>
    );
  }

  return (
    <div className="grid" style={{ width: dimensions.width, height: dimensions.height }}>
      {renderContent()}
    </div>
  );
}
