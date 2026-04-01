import { Module } from '@nestjs/common';
import { ScriptRepositoryModule } from './repository/script.repository.module';
import { ScriptUseCaseModule } from './use-case/script.use-case.module';
import { ScriptController } from './controller/script.controller';

@Module({
  imports: [ScriptRepositoryModule, ScriptUseCaseModule],
  controllers: [ScriptController],
})
export class ScriptModule {}
