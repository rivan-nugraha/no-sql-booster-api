import { Provider } from '@nestjs/common';
import { CreateScript } from './create-script.use-case';
import { ListScripts } from './list-scripts.use-case';
import { UpdateScript } from './update-script.use-case';
import { DeleteScript } from './delete-script.use-case';

export const scriptUseCaseProvider: Provider[] = [
  CreateScript,
  ListScripts,
  UpdateScript,
  DeleteScript,
];
