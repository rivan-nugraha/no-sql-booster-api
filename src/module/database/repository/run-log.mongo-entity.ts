import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'tm_run_log', timestamps: true })
export class RunLogMongoEntity extends BaseMongoEntity<typeof RunLogMongoEntity> {
  @Prop({ required: true })
  database_id: string;

  @Prop({ required: true })
  db_name: string;

  @Prop({ required: true })
  script: string;

  @Prop()
  created_by?: string;

  @Prop()
  duration_ms?: number;

  @Prop({ required: true, enum: ['OK', 'ERROR'] })
  status: 'OK' | 'ERROR';

  @Prop()
  error_message?: string;
}

export const RunLogSchema = SchemaFactory.createForClass(RunLogMongoEntity);
export const RunLogModel = [
  { name: RunLogMongoEntity.name, schema: RunLogSchema },
];
