import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/core/base/module/repository.base';
import { RunLogEntity } from '../domain/run-log.entity';
import { RunLogMapper } from '../domain/run-log.mapper';
import { RunLogMongoEntity } from './run-log.mongo-entity';

@Injectable()
export class RunLogRepository extends BaseRepository<
  RunLogEntity,
  RunLogMongoEntity
> {
  constructor(
    @InjectModel(RunLogMongoEntity.name)
    private readonly runLogModel: Model<RunLogMongoEntity>,
  ) {
    super(runLogModel, RunLogMapper);
  }
}
