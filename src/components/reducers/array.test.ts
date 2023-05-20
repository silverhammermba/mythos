import { shuffle, remove } from './array';

describe('remove', () => {
  it('does not affect empty array', () => {
    const ary = [] as number[];
    const removed = remove(ary, 3, () => true);
    expect(ary).toEqual([]);
    expect(removed).toEqual([]);
  });

  it('does not affect array when count is 0', () => {
    const ary = [1, 2, 3, 4, 5, 6, 7];
    const removed = remove(ary, 0, (n) => n > 2);
    expect(ary).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(removed).toEqual([]);
  });

  it('can remove elements from anywhere in the array', () => {
    const ary = [1, 2, 3, 4, 5];
    const removed = remove(ary, 3, (n) => n % 2 === 1);
    expect(ary).toEqual([2, 4]);
    expect(removed).toEqual([1, 3, 5]);
  });

  it('stops removing if array is empty', () => {
    const ary = [1, 2, 3, 4, 5];
    const removed = remove(ary, 10, (n) => n > 0);
    expect(ary).toEqual([]);
    expect(removed).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('shuffle', () => {
  it('does nothing to empty array', () => {
    const ary = [] as number[];
    const shuffled = shuffle(ary);
    expect(ary).toEqual([]);
    expect(shuffled).toEqual([]);
  });

  it('shuffles a non-empty array', () => {
    const ary = Array.from(Array(100).keys());

    let deranged = false;
    for (let i = 0; i < ary.length; i += 1) {
      if (ary[i] !== i) {
        deranged = true;
      }
    }
    // sanity check that the derangement validation works
    expect(deranged).toEqual(false);

    const shuffled = shuffle(ary);
    for (let i = 0; i < ary.length; i += 1) {
      if (ary[i] !== i) {
        deranged = true;
      }
    }
    expect(deranged).toEqual(true);
    expect(ary).toEqual(shuffled);

    ary.sort((a, b) => a - b);
    expect(ary).toEqual(Array.from(Array(100).keys()));
  });
});
