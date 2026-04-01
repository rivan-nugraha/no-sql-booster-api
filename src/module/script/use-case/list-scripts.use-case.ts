import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { ScriptRepositoryPort } from '../interface/script.repository.port';
import { InjectScriptRepository } from '../repository/script.repository.provider';

type TListScriptsPayload = {
  database_id?: string;
  db_name?: string;
};

@Injectable()
export class ListScripts
  extends BaseUseCase
  implements IUseCase<TListScriptsPayload>
{
  constructor(
    @InjectScriptRepository
    private readonly scriptRepository: ScriptRepositoryPort,
  ) {
    super();
  }

  async execute({ database_id, db_name }: TListScriptsPayload) {
    const query: Record<string, unknown> = {};
    if (database_id) query.database_id = database_id;
    if (db_name) query.db_name = db_name;

    const scripts = Object.keys(query).length
      ? await this.scriptRepository.findBy(query)
      : await this.scriptRepository.findAll();

    return new ResponseDto({
      status: HttpStatus.OK,
      data: scripts.map((s) => s.propsCopy),
      count: scripts.length,
    });
  }
}
