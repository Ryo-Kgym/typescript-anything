import { describe, it, expect } from 'vitest';
import { AppService } from '../src/app.service';

describe('AppService (simple)', () => {
  it('getHello メソッドが "Hello World!" を返すこと', () => {
    const appService = new AppService();
    expect(appService.getHello()).toBe('Hello World!');
  });
});
