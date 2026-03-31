import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModel } from './database.mongo-entity';
import { databaseRepositoryProvider } from './database.repository.provider';

@Module({
  imports: [MongooseModule.forFeature(DatabaseModel)],
  providers: [databaseRepositoryProvider],
  exports: [databaseRepositoryProvider],
})
export class DatabaseRepositoryModule {}
