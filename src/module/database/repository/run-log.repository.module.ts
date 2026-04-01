import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RunLogModel } from './run-log.mongo-entity';
import { runLogRepositoryProvider } from './run-log.repository.provider';

@Module({
  imports: [MongooseModule.forFeature(RunLogModel)],
  providers: [runLogRepositoryProvider],
  exports: [runLogRepositoryProvider],
})
export class RunLogRepositoryModule {}
