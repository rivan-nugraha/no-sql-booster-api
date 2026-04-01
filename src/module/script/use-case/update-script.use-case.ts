import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { ScriptRepositoryPort } from '../interface/script.repository.port';
import { InjectScriptRepository } from '../repository/script.repository.provider';

type TUpdateScriptPayload = {
  _id: string;
  name?: string;
  script?: string;
};

@Injectable()
export class UpdateScript
  extends BaseUseCase
  implements IUseCase<TUpdateScriptPayload>
{
  constructor(
    @InjectScriptRepository
    private readonly scriptRepository: ScriptRepositoryPort,
  ) {
    super();
  }

  async execute({ _id, ...data }: TUpdateScriptPayload) {
    const entity = await this.scriptRepository.findOneOrThrow({ _id });
    entity.update(data);
    const result = await this.scriptRepository.updateOne({ _id }, entity);

    return new ResponseDto({
      status: HttpStatus.OK,
      data: result,
      message: 'Script updated.',
    });
  }
}
