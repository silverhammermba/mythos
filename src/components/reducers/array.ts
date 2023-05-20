// shuffle array in place
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// remove first count elements satisfying predicate from array in-place and return them
export function remove<T>(
  array: T[],
  count: number,
  predicate: (value: T, index: number | undefined, array: T[] | undefined) => Boolean,
): T[] {
  const indices: number[] = [];
  const removed: T[] = [];

  for (let i = 0; i < array.length && removed.length < count; i += 1) {
    if (predicate(array[i], i, array)) {
      indices.push(i);
      removed.push(array[i]);
    }
  }

  for (let i = indices.length - 1; i >= 0; i -= 1) {
    array.splice(indices[i], 1);
  }

  return removed;
}
