import { describe, expect, test } from 'vitest';
import { validateInput } from '../utils/validators';

describe('validators test suite', () => {
  test('rejects negative values', () => {
    expect(validateInput(-5, 0, 1000, 'km')).toBe('Please enter a value between 0 and 1000 km');
  });

  test('accepts valid values', () => {
    expect(validateInput(25, 0, 1000, 'km')).toBeNull();
  });

  test('rejects exceeding max value', () => {
    expect(validateInput(1500, 0, 1000, 'km')).toBe('Please enter a value between 0 and 1000 km');
  });

  test('rejects non-numeric values', () => {
    expect(validateInput('abc', 0, 1000, 'km')).toBe('Please enter a valid number');
  });
});
