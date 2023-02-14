interface GetDataResult<T extends { id: string }> {
  data: Map<T['id'], T>;
  missing: Set<T['id']>;
  isComplete: boolean;
}

export function getData<T extends { id: string }>(
  input: { [id: string]: T },
  ids: Array<T['id']>,
): GetDataResult<T> {
  const data = new Map<T['id'], T>();
  const missing = new Set<T['id']>();

  ids.forEach((id) => {
    const stored = input[id];
    if (stored != null) {
      data.set(stored.id, stored);
    } else {
      missing.add(id);
    }
  });

  const isComplete = missing.size === 0;

  return { data, missing, isComplete };
}
