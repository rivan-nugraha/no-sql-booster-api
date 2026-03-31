import { Module } from '@nestjs/common';
import { DatabaseRepositoryModule } from './repository/database.repository.module';
import { DatabaseUseCaseModule } from './use-case/database.use-case.module';
import { DatabaseController } from './controller/database.controller';

@Module({
  imports: [DatabaseRepositoryModule, DatabaseUseCaseModule],
  controllers: [DatabaseController],
})
export class DatabaseModule {}
