import { Test, TestingModule } from '@nestjs/testing';
import { ReactController } from './react.controller';
import { ReactService } from './react.service';

describe('ReactController', () => {
  let controller: ReactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactController],
      providers: [ReactService],
    }).compile();

    controller = module.get<ReactController>(ReactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
