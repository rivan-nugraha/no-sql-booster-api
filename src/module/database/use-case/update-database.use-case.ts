import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { UpdateDatabaseRequestProps } from '../contract/database.request.contract';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { DatabaseEntity } from '../domain/database.entity';

type TUpdateDatabasePayload = PickUseCasePayload<
  UpdateDatabaseRequestProps,
  'data'
> &
  PickUseCasePayload<string, '_id'>;

@Injectable()
export class UpdateDatabase
  extends BaseUseCase
  implements IUseCase<TUpdateDatabasePayload>
{
  constructor(
    @InjectDatabaseRepository
    private readonly databaseRepository: DatabaseRepositoryPort,
  ) {
    super();
  }

  async execute({ _id, data }: TUpdateDatabasePayload) {
    const found = await this.databaseRepository.findOneOrThrow({ _id });

    try {
      found.update(data);
      const result = await this.databaseRepository.updateOne({ _id }, found);

      return new ResponseDto({
        status: HttpStatus.OK,
        data: result,
        message: 'Database updated.',
      });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        { message: err.message || err },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
