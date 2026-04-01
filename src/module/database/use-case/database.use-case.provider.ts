import { Provider } from '@nestjs/common';
import { CreateDatabase } from './create-database.use-case';
import { GetDatabase } from './get-database.use-case';
import { UpdateDatabase } from './update-database.use-case';
import { DeleteDatabase } from './delete-database.use-case';
import { ListDatabaseCatalog } from './list-database-catalog.use-case';
import { ListDatabaseCollections } from './list-database-collections.use-case';
import { ListCollectionDocuments } from './list-collection-documents.use-case';
import { UpdateCollectionDocument } from './update-collection-document.use-case';
import { TestDatabase } from './test-database.use-case';
import { DatabaseConnectionCache } from './database-connection-cache.service';
import { RunScript } from './run-script.use-case';

export const databaseUseCaseProvider: Provider[] = [
  DatabaseConnectionCache,
  CreateDatabase,
  GetDatabase,
  UpdateDatabase,
  DeleteDatabase,
  ListDatabaseCatalog,
  ListDatabaseCollections,
  ListCollectionDocuments,
  UpdateCollectionDocument,
  TestDatabase,
  RunScript,
];
