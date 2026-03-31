export interface CreateDatabaseRequestProps {
  name: string;
  uri: string;
  description?: string;
  icon?: string;
}

export interface UpdateDatabaseRequestProps {
  name?: string;
  uri?: string;
  description?: string;
  icon?: string;
}
