import { Module } from '@nestjs/common';
import { ScriptRepositoryModule } from '../repository/script.repository.module';
import { scriptUseCaseProvider } from './script.use-case.provider';

@Module({
  imports: [ScriptRepositoryModule],
  providers: scriptUseCaseProvider,
  exports: scriptUseCaseProvider,
})
export class ScriptUseCaseModule {}
