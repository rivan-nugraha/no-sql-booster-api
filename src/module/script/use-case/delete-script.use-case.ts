import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { ScriptRepositoryPort } from '../interface/script.repository.port';
import { InjectScriptRepository } from '../repository/script.repository.provider';

type TDeleteScriptPayload = { _id: string };

@Injectable()
export class DeleteScript
  extends BaseUseCase
  implements IUseCase<TDeleteScriptPayload>
{
  constructor(
    @InjectScriptRepository
    private readonly scriptRepository: ScriptRepositoryPort,
  ) {
    super();
  }

  async execute({ _id }: TDeleteScriptPayload) {
    const result = await this.scriptRepository.delete({ _id });

    return new ResponseDto({
      status: HttpStatus.OK,
      data: result,
      message: 'Script deleted.',
    });
  }
}
