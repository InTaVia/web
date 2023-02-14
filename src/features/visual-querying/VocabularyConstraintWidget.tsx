import type { Node, RootNode } from '@intavia/api-client';
import { ClipLoader } from 'react-spinners';

import { useAppDispatch } from '@/app/store';
import type { Constraint } from '@/features/visual-querying/constraints.types';
import { setConstraintValue } from '@/features/visual-querying/visualQuerying.slice';
import { IciclePlot } from '@/features/visualizations/icicle-plot';

interface VocabularyConstraintWidgetProps<T extends { id: string }> {
  constraint: Extract<Constraint, { kind: { id: 'vocabulary' } }>;
  data: RootNode<T> | undefined;
  isLoading: boolean;
}

export function VocabularyConstraintWidget<T extends { id: string }>(
  props: VocabularyConstraintWidgetProps<T>,
): JSX.Element {
  const { constraint, data, isLoading } = props;

  const dispatch = useAppDispatch();

  function onChangeSelection(selected: Node<T>) {
    // FIXME: what is the expected behavior here?

    const selection = new Set(constraint.value);

    if (selection.has(selected.id)) {
      selection.delete(selected.id);
    } else {
      selection.add(selected.id);
    }

    dispatch(setConstraintValue({ id: constraint.id, value: Array.from(selection) }));
  }

  if (isLoading) {
    return (
      <div className="grid min-h-[480px] place-items-center">
        <ClipLoader loading={isLoading} size="17px" color="#94c269" />
      </div>
    );
  }

  if (data == null || data.children.length === 0) {
    return (
      <div className="grid min-h-[480px] place-items-center">
        <p>Nothing found</p>
      </div>
    );
  }

  return (
    <IciclePlot data={data} onChangeSelection={onChangeSelection} selectedIds={constraint.value} />
  );
}
