import { Test, TestingModule } from '@nestjs/testing';
import { HerramientaController } from './herramienta.controller';

describe('HerramientaController', () => {
  let controller: HerramientaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HerramientaController],
    }).compile();

    controller = module.get<HerramientaController>(HerramientaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
