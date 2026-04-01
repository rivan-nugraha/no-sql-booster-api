import { Inject, Provider } from '@nestjs/common';
import { RunLogRepository } from './run-log.repository.service';

export const InjectRunLogRepository = Inject(RunLogRepository.name);

export const runLogRepositoryProvider: Provider = {
  provide: RunLogRepository.name,
  useClass: RunLogRepository,
};
