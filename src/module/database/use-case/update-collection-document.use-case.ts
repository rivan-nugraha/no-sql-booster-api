import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { DatabaseConnectionCache } from './database-connection-cache.service';

type TUpdateDocumentPayload = {
  _id: string;
  dbName: string;
  collectionName: string;
  documentId: string;
  update: Record<string, unknown>;
};

@Injectable()
export class UpdateCollectionDocument
  extends BaseUseCase
  implements IUseCase<TUpdateDocumentPayload>
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
    documentId,
    update,
  }: TUpdateDocumentPayload): Promise<ResponseDto> {
    const database = await this.databaseRepository.findOneOrThrow({ _id });
    const uri = database.propsCopy.uri;

    try {
      const conn = await this.connectionCache.getConnection(uri);
      const db = conn.useDb(dbName);
      const collection = db.db.collection(collectionName);

      // Remove _id from update payload to prevent immutable field error
      const { _id: _, ...updateData } = update;

      let filter: Record<string, unknown>;
      try {
        filter = { _id: new ObjectId(documentId) };
      } catch {
        filter = { _id: documentId };
      }

      const result = await collection.replaceOne(filter, updateData);

      if (result.matchedCount === 0) {
        throw new HttpException(
          { message: 'Document not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new ResponseDto({
        status: HttpStatus.OK,
        data: { modifiedCount: result.modifiedCount },
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(err);
      throw new HttpException(
        { message: err.message || err },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
