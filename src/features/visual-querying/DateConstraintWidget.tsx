import type { Bin } from '@intavia/api-client';
import { useEffect, useState } from 'react';

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

  const [histData, setHistData] = useState<Array<Bin<Date | IsoDateString | number>> | null>(null);

  const { data, isLoading } =
    constraint.id === 'person-birth-date'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useSearchBirthStatisticsQuery({ bins: 1600 })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useSearchDeathStatisticsQuery({});

  useEffect(() => {
    if (!data) return;

    // Process data
    const desiredNumBins = 200;
    const bins = data.bins;

    if (desiredNumBins > bins.length) {
      setHistData(data.bins);
      return;
    }

    const summarizationFactor = bins.length / desiredNumBins;

    const processedData: Array<Bin<Date | IsoDateString | number>> = [];

    for (let i = 0; i < desiredNumBins; i++) {
      const clippedData = bins.slice(
        i * summarizationFactor,
        i * summarizationFactor + summarizationFactor,
      );
      const cumCount = clippedData
        .map((d) => {
          return d.count;
        })
        .reduce((sum, num) => {
          return sum + num;
        });
      const firstValue = clippedData[0]!.values[0];
      const lastValue = clippedData[clippedData.length - 1]!.values[1];

      processedData.push({
        label: `${firstValue} - ${lastValue}`,
        count: cumCount,
        values: [firstValue, lastValue],
      });
    }

    setHistData(processedData);
  }, [data]);

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

    if (histData) {
      return (
        <Histogram
          data={histData}
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
