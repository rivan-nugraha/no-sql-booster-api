import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { CreateDatabaseRequestProps } from '../contract/database.request.contract';
import { DatabaseEntity } from '../domain/database.entity';
import { JwtDecoded } from 'src/core/base/module/use-case.base';

type TCreateDatabasePayload = PickUseCasePayload<
  CreateDatabaseRequestProps,
  'data'
> &
  PickUseCasePayload<JwtDecoded, 'user'>;

@Injectable()
export class CreateDatabase
  extends BaseUseCase
  implements IUseCase<TCreateDatabasePayload>
{
  constructor(
    @InjectDatabaseRepository
    private readonly databaseRepository: DatabaseRepositoryPort,
  ) {
    super();
  }

  async execute({ data, user }: TCreateDatabasePayload) {
    await this.databaseRepository.findOneAndThrow(
      { name: data.name },
      'Database name already exists.',
    );

    try {
      const entity = new DatabaseEntity({
        name: data.name,
        uri: data.uri,
        description: data.description,
        created_by: user?.user_id,
        icon: data.icon,
      });

      const result = await this.databaseRepository.save(entity);

      return new ResponseDto({
        status: HttpStatus.CREATED,
        data: result,
        message: 'Database created.',
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
