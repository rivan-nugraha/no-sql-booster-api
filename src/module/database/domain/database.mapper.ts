import { DatabaseEntity } from './database.entity';
import { DatabaseMongoEntity } from '../repository/database.mongo-entity';
import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { staticImplements } from 'src/core/decorator/static-implements.decorator';

@staticImplements<DbMapper<DatabaseEntity, DatabaseMongoEntity>>()
export class DatabaseMapper {
  public static toPlainObject(
    entity: DatabaseEntity,
  ): MongoEntityProps<DatabaseMongoEntity> {
    const props = entity.propsCopy;
    return {
      _id: props._id,
      name: props.name,
      uri: props.uri,
      description: props.description,
      created_by: props.created_by,
      icon: props.icon,
    };
  }

  public static toDomain(raw: DatabaseMongoEntity): DatabaseEntity {
    return new DatabaseEntity(
      {
        name: raw.name,
        uri: raw.uri,
        description: raw.description,
        created_by: raw.created_by,
        icon: raw.icon,
      },
      raw._id,
    );
  }
}
