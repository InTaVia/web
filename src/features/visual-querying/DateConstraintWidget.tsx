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
  constraint: PersonBirthDateConstraint | PersonDeathDateConstraint;
}

export function DateConstraintWidget(props: DateConstraintWidgetProps): JSX.Element {
  const { constraint } = props;
  const dispatch = useAppDispatch();

  const { data, isLoading } =
    constraint.id === 'person-birth-date'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useSearchBirthStatisticsQuery({ bins: 1600 })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useSearchDeathStatisticsQuery({ bins: 1600 });

  function setBrushedArea(area: [number, number]) {
    dispatch(
      setConstraintValue({
        id: constraint.id,
        value: area,
      }),
    );
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!data) {
    return <p>No data</p>;
  }

  return (
    <Histogram
      rawData={data.bins}
      initialBrushedArea={constraint.value}
      onChangeBrushedArea={setBrushedArea}
    />
  );
}
