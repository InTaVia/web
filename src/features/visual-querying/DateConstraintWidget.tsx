import { useSearchBirthStatisticsQuery } from '@/api/intavia.service';
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

  const { data, isLoading } = useSearchBirthStatisticsQuery({});

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
      return <p>Loading ...</p>;
    }

    if (data) {
      return (
        <Histogram
          data={data.bins}
          initialBrushedArea={constraint.value}
          onChangeBrushedArea={setBrushedArea}
        />
      );
    }

    return <p>No data</p>;
  }

  return (
    <div className="grid" style={{ width: dimensions.width, height: dimensions.height }}>
      {renderContent()}
    </div>
  );
}
