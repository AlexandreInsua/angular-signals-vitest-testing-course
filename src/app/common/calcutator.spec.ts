import { describe, expect, it, vi } from 'vitest';
import { calculator } from './calculator';

describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  it('should', () => {
    const addSpy = vi.spyOn(calculator, 'add');
    const result = calculator.add(2, 3);
    expect(addSpy).toHaveBeenCalledOnce();
    expect(addSpy).toHaveBeenCalledWith(2, 3);
    expect(result).toBe(5);
  });
  it('should handle adding negative numbers', () => {
    const result = calculator.add(-2, -3);
    expect(result).toBe(-5);
  });

  it('should handle adding zero', () => {
    const result = calculator.add(0, 5);
    expect(result).toBe(5);
  });

  it('should handle adding large numbers', () => {
    const result = calculator.add(1e10, 1e10);
    expect(result).toBe(2e10);
  });

  it('should handle adding decimal numbers', () => {
    const result = calculator.add(0.1, 0.2);
    expect(result).toBeCloseTo(0.3);
  });

  it('should handle adding string  values', () => {
    const result = calculator.add('a' as any, 1);
    expect(result).toBe('a1');
  });

  it('should handle adding nullish values', () => {
    const result = calculator.add(null as any, undefined as any);
    expect(result).toBeNaN();
  });
});
