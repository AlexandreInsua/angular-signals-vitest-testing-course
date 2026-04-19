import { beforeEach, describe, expect, it } from 'vitest';
import { DurationFormatPipe } from './duration-format.pipe';

describe('DurationFormatPipe', () => {
  let pipe: DurationFormatPipe;

  beforeEach(() => {
    pipe = new DurationFormatPipe();
  });

  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });
});
