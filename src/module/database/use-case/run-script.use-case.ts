import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { DatabaseRepositoryPort } from '../interface/database.repository.port';
import { InjectDatabaseRepository } from '../repository/database.repository.provider';
import { DatabaseConnectionCache } from './database-connection-cache.service';
import { InjectRunLogRepository } from '../repository/run-log.repository.provider';
import { RunLogRepository } from '../repository/run-log.repository.service';
import { RunLogEntity } from '../domain/run-log.entity';

type TRunScriptPayload = {
  _id: string;
  dbName: string;
  script: string;
  limit?: number;
  created_by?: string;
};

@Injectable()
export class RunScript
  extends BaseUseCase
  implements IUseCase<TRunScriptPayload>
{
  private readonly DEFAULT_LIMIT = 200;

  constructor(
    @InjectDatabaseRepository
    private readonly databaseRepository: DatabaseRepositoryPort,
    private readonly connectionCache: DatabaseConnectionCache,
    @InjectRunLogRepository
    private readonly runLogRepository: RunLogRepository,
  ) {
    super();
  }

  async execute({ _id, dbName, script, limit, created_by }: TRunScriptPayload) {
    const database = await this.databaseRepository.findOneOrThrow({ _id });
    const uri = database.propsCopy.uri;

    const hardLimit =
      typeof limit === 'number' && limit > 0 && limit < 5000
        ? limit
        : this.DEFAULT_LIMIT;

    const started = Date.now();
    let status: 'OK' | 'ERROR' = 'OK';
    let errorMessage: string | undefined;
    let data: unknown;
    let count: number | undefined;
    const consoleLogs: string[] = [];
    let fallbackLoggedValue: any;
    let fallbackLoggedCursor: any;

    try {
      const conn = await this.connectionCache.getConnection(uri);
      const nativeDb = conn.useDb(dbName).db;

      // Convenience: allow shell-style projection shorthand in find(filter, {a:1})
      const originalCollection = nativeDb.collection.bind(nativeDb);
      nativeDb.collection = (name: string) => {
        const col = originalCollection(name);
        const originalFind = col.find.bind(col);
        col.find = (filter?: any, options?: any, ...rest: any[]) => {
          let opts = options;
          if (
            options &&
            !options.projection &&
            typeof options === 'object' &&
            Object.values(options).every(
              (v) => v === 0 || v === 1 || v === true || v === false,
            )
          ) {
            opts = { ...options, projection: options };
          }
          return originalFind(filter, opts, ...rest);
        };
        return col;
      };

      const consoleShim = {
        log: (...args: any[]) => {
          // Capture first logged value for fallback result
          if (fallbackLoggedValue === undefined && args.length > 0) {
            fallbackLoggedValue = args[0];
            if (
              fallbackLoggedCursor === undefined &&
              args[0] &&
              typeof (args[0] as any).toArray === 'function'
            ) {
              fallbackLoggedCursor = args[0];
            }
          }
          const msg = args
            .map((a) =>
              typeof a === 'string'
                ? a
                : (() => {
                    try {
                      return JSON.stringify(a);
                    } catch {
                      return String(a);
                    }
                  })(),
            )
            .join(' ');
          consoleLogs.push(msg);
        },
      };

      // Light sandbox: expose only db + console; evaluate user code via eval to avoid template string breakage
      const runner = new Function(
        'db',
        'console',
        'code',
        `"use strict"; return (async () => { return await eval("(async () => { " + code + " })()"); })();`,
      );

      let raw = await runner(nativeDb, consoleShim, script);
      // If user forgot to return and result is a cursor, it will be handled below; otherwise leave as-is
      data = raw;

      // If cursor-like, toArray with limit to avoid huge payloads
      if (raw && typeof (raw as any).toArray === 'function') {
        // Try to apply limit on cursor if available
        if (typeof (raw as any).limit === 'function') {
          (raw as any).limit(hardLimit);
        }
        const arr = await (raw as any).toArray();
        data = arr;
        count = Array.isArray(arr) ? arr.length : undefined;
      } else if (Array.isArray(raw)) {
        const arr = raw as unknown[];
        data = arr.slice(0, hardLimit);
        count = (data as unknown[]).length;
      } else if (fallbackLoggedCursor && typeof (fallbackLoggedCursor as any).toArray === 'function') {
        // No return value; try to materialize logged cursor
        if (typeof (fallbackLoggedCursor as any).limit === 'function') {
          (fallbackLoggedCursor as any).limit(hardLimit);
        }
        const arr = await (fallbackLoggedCursor as any).toArray();
        data = arr;
        count = Array.isArray(arr) ? arr.length : undefined;
      } else if (fallbackLoggedValue !== undefined) {
        data = fallbackLoggedValue;
      }

    } catch (err) {
      status = 'ERROR';
      errorMessage = err?.message || String(err);
      this.logger.error(err);
      throw new HttpException({ message: errorMessage }, HttpStatus.BAD_GATEWAY);
    } finally {
      const duration = Date.now() - started;
      // Fire-and-forget logging; errors shouldn’t block response
      this.runLogRepository
        .saveReturnDocument(
          new RunLogEntity({
            database_id: _id,
            db_name: dbName,
            script,
            created_by,
            duration_ms: duration,
            status,
            error_message: errorMessage,
          }),
        )
        .catch((e) => this.logger.warn(`RunLog save failed: ${e?.message || e}`));
    }

    return new ResponseDto({
      status: HttpStatus.OK,
      data: { result: data ?? null, logs: consoleLogs },
      count,
      message: 'Script executed.',
    });
  }
}
