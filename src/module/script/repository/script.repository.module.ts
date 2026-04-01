import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScriptModel } from './script.mongo-entity';
import { scriptRepositoryProvider } from './script.repository.provider';

@Module({
  imports: [MongooseModule.forFeature(ScriptModel)],
  providers: [scriptRepositoryProvider],
  exports: [scriptRepositoryProvider],
})
export class ScriptRepositoryModule {}
