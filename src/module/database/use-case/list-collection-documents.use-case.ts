import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { DatabaseConnectionCache } from './database-connection-cache.service';

type TListDocumentsPayload = {
  _id: string;
  dbName: string;
  collectionName: string;
  skip: number;
  limit: number;
};
type TListDocumentsResponse = ResponseDto<Record<string, unknown>[]>;

@Injectable()
export class ListCollectionDocuments
  extends BaseUseCase
  implements IUseCase<TListDocumentsPayload>
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
    collectionName,
    skip,
    limit,
  }: TListDocumentsPayload): Promise<TListDocumentsResponse> {
    const database = await this.databaseRepository.findOneOrThrow({ _id });
    const uri = database.propsCopy.uri;

    try {
      const conn = await this.connectionCache.getConnection(uri);
      const db = conn.useDb(dbName);
      const collection = db.db.collection(collectionName);

      const [documents, total] = await Promise.all([
        collection.find({}).skip(skip).limit(limit).toArray(),
        collection.estimatedDocumentCount(),
      ]);

      return new ResponseDto({
        status: HttpStatus.OK,
        data: documents as Record<string, unknown>[],
        count: total,
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
