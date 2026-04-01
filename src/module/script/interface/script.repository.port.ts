import { BaseRepositoryPort } from 'src/core/port/repository.base.port';
import { ScriptEntity } from '../domain/script.entity';
import { ScriptMongoEntity } from '../repository/script.mongo-entity';

export interface ScriptRepositoryPort
  extends BaseRepositoryPort<ScriptEntity, ScriptMongoEntity> {}
