import { Entity } from 'src/core/base/domain/entity';
import { Types } from 'mongoose';

export interface DatabaseProps {
  name: string;
  uri: string;
  description?: string;
  created_by?: string;
  icon?: string;
}

export interface UpdateDatabaseProps {
  name?: string;
  uri?: string;
  description?: string;
  icon?: string;
}

export class DatabaseEntity extends Entity<DatabaseProps> {
  constructor(props: DatabaseProps, _id?: Types.ObjectId) {
    super(props, _id);
  }

  update(payload: UpdateDatabaseProps) {
    if (payload.name) this.props.name = payload.name;
    if (payload.uri) this.props.uri = payload.uri;
    if (payload.description !== undefined)
    this.props.description = payload.description;
    if (payload.icon !== undefined) this.props.icon = payload.icon;
  }
}
