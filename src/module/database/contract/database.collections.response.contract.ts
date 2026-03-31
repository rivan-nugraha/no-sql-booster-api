export interface DatabaseCollectionResponseProps {
  name: string;
  type: string;
  count: number;
  size: number;
  avgObjSize: number;
  storageSize: number;
  indexes: number;
  indexSize: number;
}
