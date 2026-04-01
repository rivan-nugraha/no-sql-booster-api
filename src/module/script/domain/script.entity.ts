import { Entity } from 'src/core/base/domain/entity';
import { Types } from 'mongoose';

export interface ScriptProps {
  name: string;
  database_id?: string;
  db_name?: string;
  script: string;
  created_by?: string;
}

export interface UpdateScriptProps {
  name?: string;
  script?: string;
}

export class ScriptEntity extends Entity<ScriptProps> {
  constructor(props: ScriptProps, _id?: Types.ObjectId) {
    super(props, _id);
  }

  update(payload: UpdateScriptProps) {
    if (payload.name) this.props.name = payload.name;
    if (payload.script !== undefined) this.props.script = payload.script;
  }
}
