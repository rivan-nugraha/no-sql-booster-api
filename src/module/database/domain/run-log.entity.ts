import { Entity } from 'src/core/base/domain/entity';
import { Types } from 'mongoose';

export interface RunLogProps {
  database_id: string;
  db_name: string;
  script: string;
  created_by?: string;
  duration_ms?: number;
  status: 'OK' | 'ERROR';
  error_message?: string;
}

export class RunLogEntity extends Entity<RunLogProps> {
  constructor(props: RunLogProps, _id?: Types.ObjectId) {
    super(props, _id);
  }
}
