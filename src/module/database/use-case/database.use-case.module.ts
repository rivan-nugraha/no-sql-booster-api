import { Module } from '@nestjs/common';
import { DatabaseRepositoryModule } from '../repository/database.repository.module';
import { RunLogRepositoryModule } from '../repository/run-log.repository.module';
import { databaseUseCaseProvider } from './database.use-case.provider';

@Module({
  imports: [DatabaseRepositoryModule, RunLogRepositoryModule],
  providers: databaseUseCaseProvider,
  exports: databaseUseCaseProvider,
})
export class DatabaseUseCaseModule {}
