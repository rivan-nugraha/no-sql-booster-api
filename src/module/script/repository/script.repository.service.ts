import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/core/base/module/repository.base';
import { ScriptEntity } from '../domain/script.entity';
import { ScriptMapper } from '../domain/script.mapper';
import { ScriptMongoEntity } from './script.mongo-entity';
import { ScriptRepositoryPort } from '../interface/script.repository.port';

@Injectable()
export class ScriptRepository
  extends BaseRepository<ScriptEntity, ScriptMongoEntity>
  implements ScriptRepositoryPort
{
  constructor(
    @InjectModel(ScriptMongoEntity.name)
    private readonly scriptModel: Model<ScriptMongoEntity>,
  ) {
    super(scriptModel, ScriptMapper);
  }
}
