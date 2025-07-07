import { Test, TestingModule } from '@nestjs/testing';
import { HerramientaService } from './herramienta.service';

describe('HerramientaService', () => {
  let service: HerramientaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HerramientaService],
    }).compile();

    service = module.get<HerramientaService>(HerramientaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
