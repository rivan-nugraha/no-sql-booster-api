import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { DatabaseCollectionResponseProps } from '../contract/database.collections.response.contract';
import { DatabaseConnectionCache } from './database-connection-cache.service';

type TListCollectionsPayload = { _id: string; dbName: string };
type TListCollectionsResponse = ResponseDto<DatabaseCollectionResponseProps[]>;

@Injectable()
export class ListDatabaseCollections
  extends BaseUseCase
  implements IUseCase<TListCollectionsPayload>
{
  constructor(
    @InjectDatabaseRepository
    private readonly databaseRepository: DatabaseRepositoryPort,
    private readonly connectionCache: DatabaseConnectionCache,
  ) {
    super();
  }

  async execute({
    _id,
    dbName,
  }: TListCollectionsPayload): Promise<TListCollectionsResponse> {
    const database = await this.databaseRepository.findOneOrThrow({ _id });
    const uri = database.propsCopy.uri;

    try {
      const conn = await this.connectionCache.getConnection(uri);
      const db = conn.useDb(dbName);

      const collections = await db.db.listCollections().toArray();

      const mapped: DatabaseCollectionResponseProps[] = await Promise.all(
        collections.map(async (col) => {
          try {
            const [collStats] = await db.db
              .collection(col.name)
              .aggregate([
                { $collStats: { storageStats: {} } },
              ])
              .toArray();

            const s = collStats?.storageStats ?? {};
            return {
              name: col.name,
              type: col.type || 'collection',
              count: s.count ?? 0,
              size: s.size ?? 0,
              avgObjSize: s.avgObjSize ?? 0,
              storageSize: s.storageSize ?? 0,
              indexes: s.nindexes ?? 0,
              indexSize: s.totalIndexSize ?? 0,
            };
          } catch {
            return {
              name: col.name,
              type: col.type || 'collection',
              count: 0,
              size: 0,
              avgObjSize: 0,
              storageSize: 0,
              indexes: 0,
              indexSize: 0,
            };
          }
        }),
      );

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
