import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  beforeEach(async () => {
    appService = new AppService();
    vi.spyOn(appService, 'getHello').mockImplementation(() => 'Hello World!');
    appController = new AppController(appService);
  });

  describe('root', () => {
    it('アプリケーションが "Hello World!" を返すこと', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
