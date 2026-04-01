import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'tm_script', timestamps: true })
export class ScriptMongoEntity extends BaseMongoEntity<typeof ScriptMongoEntity> {
  @Prop({ required: true })
  name: string;

  @Prop()
  database_id?: string;

  @Prop()
  db_name?: string;

  @Prop({ required: true })
  script: string;

  @Prop()
  created_by?: string;
}

export const ScriptSchema = SchemaFactory.createForClass(ScriptMongoEntity);
export const ScriptModel = [
  { name: ScriptMongoEntity.name, schema: ScriptSchema },
];
