import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';

type TDeleteDatabasePayload = PickUseCasePayload<string, '_id'>;

@Injectable()
export class DeleteDatabase
  extends BaseUseCase
  implements IUseCase<TDeleteDatabasePayload>
{
  constructor(
    @InjectDatabaseRepository
    private readonly databaseRepository: DatabaseRepositoryPort,
  ) {
    super();
  }

  async execute({ _id }: TDeleteDatabasePayload) {
    const result = await this.databaseRepository.delete({ _id });

    return new ResponseDto({
      status: HttpStatus.OK,
      data: result,
      message: 'Database deleted.',
    });
  }
}
