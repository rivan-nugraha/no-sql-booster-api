import { HttpStatus, Injectable } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { TestDatabaseRequestProps } from '../contract/database.test.contract';

type TTestPayload = PickUseCasePayload<TestDatabaseRequestProps, 'data'>;

@Injectable()
export class TestDatabase extends BaseUseCase implements IUseCase<TTestPayload> {
  async execute({ data }: TTestPayload) {
    let conn: Connection | null = null;
    try {
      conn = await createConnection(data.uri).asPromise();
      await conn.db.admin().ping();
      return new ResponseDto({
        status: HttpStatus.OK,
        data: { ok: true },
        message: 'Connection successful',
      });
    } finally {
      if (conn) await conn.close().catch(() => null);
    }
  }
}
