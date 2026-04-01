import { Inject, Provider } from '@nestjs/common';
import { ScriptRepository } from './script.repository.service';

export const InjectScriptRepository = Inject(ScriptRepository.name);

export const scriptRepositoryProvider: Provider = {
  provide: ScriptRepository.name,
  useClass: ScriptRepository,
};
