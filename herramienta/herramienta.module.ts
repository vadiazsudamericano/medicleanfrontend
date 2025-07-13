import { Module } from '@nestjs/common';
import { HerramientaController } from './herramienta.controller';
import { HerramientaService } from './herramienta.service';

@Module({
  controllers: [HerramientaController],
  providers: [HerramientaService]
})
export class HerramientaModule {}
