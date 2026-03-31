import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/core/base/module/repository.base';
import { DatabaseEntity } from '../domain/database.entity';
import { DatabaseMapper } from '../domain/database.mapper';
import { DatabaseMongoEntity } from './database.mongo-entity';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';

@Injectable()
export class DatabaseRepository
  extends BaseRepository<DatabaseEntity, DatabaseMongoEntity>
  implements DatabaseRepositoryPort
{
  constructor(
    @InjectModel(DatabaseMongoEntity.name)
    private readonly databaseModel: Model<DatabaseMongoEntity>,
  ) {
    super(databaseModel, DatabaseMapper);
  }
}
