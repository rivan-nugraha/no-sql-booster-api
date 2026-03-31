import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { DatabaseCatalogResponseProps } from '../contract/database.catalog.response.contract';
import { DatabaseConnectionCache } from './database-connection-cache.service';

type TListCatalogPayload = PickUseCasePayload<string, '_id'>;
type TListCatalogResponse = ResponseDto<DatabaseCatalogResponseProps[]>;

@Injectable()
export class ListDatabaseCatalog
  extends BaseUseCase
  implements IUseCase<TListCatalogPayload>
{
  constructor(
    @InjectDatabaseRepository
    private readonly databaseRepository: DatabaseRepositoryPort,
    private readonly connectionCache: DatabaseConnectionCache,
  ) {
    super();
  }

  async execute({ _id }: TListCatalogPayload): Promise<TListCatalogResponse> {
    const database = await this.databaseRepository.findOneOrThrow({ _id });
    const uri = database.propsCopy.uri;

    try {
      const conn = await this.connectionCache.getConnection(uri);
      const admin = conn.db.admin();
      const { databases } = await admin.listDatabases();
      const mapped = databases.map((db) => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk,
        empty: db.empty,
      }));

      return new ResponseDto({
        status: HttpStatus.OK,
        data: mapped,
        count: mapped.length,
      });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        { message: err.message || err },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
