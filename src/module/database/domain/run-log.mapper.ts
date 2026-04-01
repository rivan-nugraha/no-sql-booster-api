import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { staticImplements } from 'src/core/decorator/static-implements.decorator';
import { RunLogEntity } from './run-log.entity';
import { RunLogMongoEntity } from '../repository/run-log.mongo-entity';

@staticImplements<DbMapper<RunLogEntity, RunLogMongoEntity>>()
export class RunLogMapper {
  public static toPlainObject(
    entity: RunLogEntity,
  ): MongoEntityProps<RunLogMongoEntity> {
    const props = entity.propsCopy;
    return {
      _id: props._id,
      database_id: props.database_id,
      db_name: props.db_name,
      script: props.script,
      created_by: props.created_by,
      duration_ms: props.duration_ms,
      status: props.status,
      error_message: props.error_message,
    };
  }

  public static toDomain(raw: RunLogMongoEntity): RunLogEntity {
    return new RunLogEntity(
      {
        database_id: raw.database_id,
        db_name: raw.db_name,
        script: raw.script,
        created_by: raw.created_by,
        duration_ms: raw.duration_ms,
        status: raw.status,
        error_message: raw.error_message,
      },
      raw._id,
    );
  }
}
