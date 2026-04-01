import { Body, Controller, Param, Query } from '@nestjs/common';
import { GetPaginationDto } from 'src/core/base/http/get-pagination.dto.base';
import { JwtDecoded } from 'src/core/base/module/use-case.base';
import { AuthUser } from 'src/core/decorator/auth-user.decorator';
import { SecureDelete } from 'src/core/decorator/secure-delete.decorator';
import { SecureGet } from 'src/core/decorator/secure-get.decorator';
import { SecurePost } from 'src/core/decorator/secure-post.decorator';
import { SecurePut } from 'src/core/decorator/secure-put.decorator';
import { CreateDatabase } from '../use-case/create-database.use-case';
import { DeleteDatabase } from '../use-case/delete-database.use-case';
import { GetDatabase } from '../use-case/get-database.use-case';
import { UpdateDatabase } from '../use-case/update-database.use-case';
import { ListDatabaseCatalog } from '../use-case/list-database-catalog.use-case';
import { ListDatabaseCollections } from '../use-case/list-database-collections.use-case';
import { ListCollectionDocuments } from '../use-case/list-collection-documents.use-case';
import { UpdateCollectionDocument } from '../use-case/update-collection-document.use-case';
import { TestDatabase } from '../use-case/test-database.use-case';
import { RunScript } from '../use-case/run-script.use-case';
import { ListDocumentsQueryDto } from './dto/list-documents-query.dto';
import { CreateDatabaseRequestDto } from './dto/create-database.request.dto';
import { UpdateDatabaseRequestDto } from './dto/update-database.request.dto';
import { TestDatabaseRequestDto } from './dto/test-database.request.dto';
import { RunScriptRequestDto } from './dto/run-script.request.dto';

@Controller('v1/databases')
export class DatabaseController {
  constructor(
    private readonly createDatabase: CreateDatabase,
    private readonly getDatabase: GetDatabase,
    private readonly updateDatabase: UpdateDatabase,
    private readonly deleteDatabase: DeleteDatabase,
    private readonly listDatabaseCatalog: ListDatabaseCatalog,
    private readonly listDatabaseCollections: ListDatabaseCollections,
    private readonly listCollectionDocuments: ListCollectionDocuments,
    private readonly updateCollectionDocument: UpdateCollectionDocument,
    private readonly testDatabase: TestDatabase,
    private readonly runScript: RunScript,
  ) {}

  @SecurePost()
  async create(
    @Body() body: CreateDatabaseRequestDto,
    @AuthUser() user: JwtDecoded,
  ) {
    return this.createDatabase.execute({ data: body, user });
  }

  @SecureGet()
  async findAll(@Query() query: GetPaginationDto) {
    return this.getDatabase.execute({ data: query });
  }

  @SecurePut(':_id')
  async update(
    @Param('_id') _id: string,
    @Body() body: UpdateDatabaseRequestDto,
  ) {
    return this.updateDatabase.execute({ _id, data: body });
  }

  @SecureDelete(':_id')
  async delete(@Param('_id') _id: string) {
    return this.deleteDatabase.execute({ _id });
  }

  @SecureGet(':_id/catalog')
  async listCatalog(@Param('_id') _id: string) {
    return this.listDatabaseCatalog.execute({ _id });
  }

  @SecureGet(':_id/catalog/:dbName/collections')
  async listCollections(
    @Param('_id') _id: string,
    @Param('dbName') dbName: string,
  ) {
    return this.listDatabaseCollections.execute({ _id, dbName });
  }

  @SecureGet(':_id/catalog/:dbName/collections/:collectionName/documents')
  async listDocuments(
    @Param('_id') _id: string,
    @Param('dbName') dbName: string,
    @Param('collectionName') collectionName: string,
    @Query() query: ListDocumentsQueryDto,
  ) {
    let filter: Record<string, unknown> | undefined;
    if (query.filter) {
      try {
        filter = JSON.parse(query.filter);
      } catch {
        filter = undefined;
      }
    }
    return this.listCollectionDocuments.execute({
      _id,
      dbName,
      collectionName,
      skip: Number(query.skip) || 0,
      limit: Number(query.limit) || 50,
      filter,
    });
  }

  @SecurePut(':_id/catalog/:dbName/collections/:collectionName/documents/:documentId')
  async updateDocument(
    @Param('_id') _id: string,
    @Param('dbName') dbName: string,
    @Param('collectionName') collectionName: string,
    @Param('documentId') documentId: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.updateCollectionDocument.execute({
      _id,
      dbName,
      collectionName,
      documentId,
      update: body,
    });
  }

  @SecurePost('test')
  async test(@Body() body: TestDatabaseRequestDto) {
    return this.testDatabase.execute({ data: body });
  }

  @SecurePost(':_id/catalog/:dbName/run')
  async run(
    @Param('_id') _id: string,
    @Param('dbName') dbName: string,
    @Body() body: RunScriptRequestDto,
    @AuthUser() user: JwtDecoded,
  ) {
    // user kept for future authorization/auditing
    return this.runScript.execute({
      _id,
      dbName,
      script: body.script,
      limit: body.limit,
      created_by: user?.user_id,
    });
  }
}
