import { BaseRepositoryPort } from 'src/core/port/repository.base.port';
import { DatabaseEntity } from '../domain/database.entity';
import { DatabaseMongoEntity } from '../repository/database.mongo-entity';

export interface DatabaseRepositoryPort
  extends BaseRepositoryPort<DatabaseEntity, DatabaseMongoEntity> {}
