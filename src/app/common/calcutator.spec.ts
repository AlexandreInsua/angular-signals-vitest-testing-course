import { describe, expect, it } from 'vitest';
import { calculator } from './calculator';

describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });
});
