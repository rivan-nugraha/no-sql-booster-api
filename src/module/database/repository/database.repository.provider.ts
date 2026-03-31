import { Inject, Provider } from '@nestjs/common';
import { DatabaseRepository } from './database.repository.service';

export const InjectDatabaseRepository = Inject(DatabaseRepository.name);

export const databaseRepositoryProvider: Provider = {
  provide: DatabaseRepository.name,
  useClass: DatabaseRepository,
};
