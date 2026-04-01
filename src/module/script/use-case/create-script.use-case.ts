import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { ScriptRepositoryPort } from '../interface/script.repository.port';
import { InjectScriptRepository } from '../repository/script.repository.provider';
import { ScriptEntity } from '../domain/script.entity';

type TCreateScriptPayload = {
  name: string;
  database_id?: string;
  db_name?: string;
  script: string;
  created_by?: string;
};

@Injectable()
export class CreateScript
  extends BaseUseCase
  implements IUseCase<TCreateScriptPayload>
{
  constructor(
    @InjectScriptRepository
    private readonly scriptRepository: ScriptRepositoryPort,
  ) {
    super();
  }

  async execute(payload: TCreateScriptPayload) {
    const entity = new ScriptEntity({
      name: payload.name,
      database_id: payload.database_id,
      db_name: payload.db_name,
      script: payload.script,
      created_by: payload.created_by,
    });

    const result = await this.scriptRepository.save(entity);

    return new ResponseDto({
      status: HttpStatus.CREATED,
      data: result,
      message: 'Script created.',
    });
  }
}
