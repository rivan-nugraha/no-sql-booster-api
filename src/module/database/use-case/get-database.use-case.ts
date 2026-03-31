import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { GetPaginationProps } from 'src/core/contract/get-pagination.request.contract';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { DatabaseMapper } from '../domain/database.mapper';
import { DatabaseResponseProps } from '../contract/database.response.contract';

type TGetDatabasePayload = PickUseCasePayload<GetPaginationProps, 'data'>;
type TGetDatabaseResponse = ResponseDto<DatabaseResponseProps[]>;

@Injectable()
export class GetDatabase
  extends BaseUseCase
  implements IUseCase<TGetDatabasePayload>
{
  constructor(
    @InjectDatabaseRepository
    private readonly databaseRepository: DatabaseRepositoryPort,
  ) {
    super();
  }

  async execute({ data }: TGetDatabasePayload): Promise<TGetDatabaseResponse> {
    const databases = await this.databaseRepository.findByPaginateSorted(
      {},
      { skip: Number(data.skip), limit: Number(data.limit) },
      data.sort_by || { _id: 1 },
    );

    const mapped = databases.map((db) => {
      const plain = DatabaseMapper.toPlainObject(db);
      return {
        _id: plain._id,
        name: plain.name,
        uri: plain.uri,
        description: plain.description,
        created_by: plain.created_by,
        icon: plain.icon,
      };
    });

    return new ResponseDto({
      status: HttpStatus.OK,
      data: mapped,
      count: mapped.length,
    });
  }
}
