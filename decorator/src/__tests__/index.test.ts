import { describe, it, expect } from 'vitest';
import { greet } from '../index';

describe('greet関数', () => {
  it('名前付きの挨拶を返す', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
