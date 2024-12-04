import { difference } from '../../src/utils/difference.js';

describe('difference', () => {
  it('should return difference in values', () => {
    const base = { field: 'value' };
    const modified = { field: 'other value' };

    const diff = difference(modified, base);

    expect(diff).toMatchObject({
      field: {
        before: 'value',
        after: 'other value',
      },
    });
  });

  it('should return difference if new field appears', () => {
    const base = {};
    const modified = { field: 'value' };

    const diff = difference(modified, base);

    expect(diff).toMatchObject({
      field: {
        before: undefined,
        after: 'value',
      },
    });
  });

  it('should return difference field disappears', () => {
    const base = { field: 'value' };
    const modified = {};

    const diff = difference(modified, base);

    expect(diff).toMatchObject({
      field: {
        after: undefined,
        before: 'value',
      },
    });
  });
});
