import { beforeEach, describe, expect, it } from 'vitest';
import { DurationFormatPipe } from './duration-format.pipe';

describe('DurationFormatPipe', () => {
  // o setup deste test é moi simple
  // con unha simple instanciación funcionaría:
  // const pipe = new DurationFormatPipe();
  // pero queremos manter o principio de que cada test debe ser autocontido

  let pipe: DurationFormatPipe;

  beforeEach(() => {
    pipe = new DurationFormatPipe();
  });

  // caso trivial
  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  // casos de uso
  it('should format duration', () => {
    const result = pipe.transform('05:30');
    expect(result).toBe('05h 30m');
  });

  it('should handle null or undefined', () => {
    let result = pipe.transform(null as unknown as string);
    expect(result).toBe('');
    result = pipe.transform(undefined as unknown as string);
    expect(result).toBe('');
  });

  it('should return the original value if invalid input', () => {
    const result = pipe.transform('90');
    expect(result).toBe('90');
  });

  it('should only format the first two parts', () => {
    const result = pipe.transform('01:20:45');
    expect(result).toBe('01h 20m');
  });
});
