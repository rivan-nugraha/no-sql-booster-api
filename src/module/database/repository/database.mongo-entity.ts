import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'tm_database' })
export class DatabaseMongoEntity extends BaseMongoEntity<typeof DatabaseMongoEntity> {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  uri: string;

  @Prop()
  description?: string;

  @Prop()
  created_by?: string;

  @Prop()
  input_date?: Date;

  @Prop()
  icon?: string;

  @Prop()
  edit_by?: string;

  @Prop()
  edit_date?: Date;
}

export const DatabaseSchema = SchemaFactory.createForClass(DatabaseMongoEntity);
export const DatabaseModel = [
  { name: DatabaseMongoEntity.name, schema: DatabaseSchema },
];
