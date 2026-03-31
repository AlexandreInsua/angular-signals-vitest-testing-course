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

describe('Vitest Fundametals', () => {
  it('shows how mockReset() works for spies', () => {
    const spy = vi.spyOn(calculator, 'add');
    spy.mockReturnValue(10);
    const result = calculator.add(2, 3);
    expect(result).toBe(10);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it.only('shows how mockReset() works pure mocks', () => {
    const addMock = vi.fn().mockReturnValue(10);
    const result = addMock(5, 5);
    expect(result).toBe(10);
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenCalledWith(5, 5);
  });
});
