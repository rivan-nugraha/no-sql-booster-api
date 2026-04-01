import { ScriptEntity } from './script.entity';
import { ScriptMongoEntity } from '../repository/script.mongo-entity';
import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { staticImplements } from 'src/core/decorator/static-implements.decorator';

@staticImplements<DbMapper<ScriptEntity, ScriptMongoEntity>>()
export class ScriptMapper {
  public static toPlainObject(
    entity: ScriptEntity,
  ): MongoEntityProps<ScriptMongoEntity> {
    const props = entity.propsCopy;
    return {
      _id: props._id,
      name: props.name,
      database_id: props.database_id,
      db_name: props.db_name,
      script: props.script,
      created_by: props.created_by,
    };
  }

  public static toDomain(raw: ScriptMongoEntity): ScriptEntity {
    return new ScriptEntity(
      {
        name: raw.name,
        database_id: raw.database_id,
        db_name: raw.db_name,
        script: raw.script,
        created_by: raw.created_by,
      },
      raw._id,
    );
  }
}
