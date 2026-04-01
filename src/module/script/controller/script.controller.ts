import { Body, Controller, Param, Query } from '@nestjs/common';
import { SecureGet } from 'src/core/decorator/secure-get.decorator';
import { SecurePost } from 'src/core/decorator/secure-post.decorator';
import { SecurePut } from 'src/core/decorator/secure-put.decorator';
import { SecureDelete } from 'src/core/decorator/secure-delete.decorator';
import { AuthUser } from 'src/core/decorator/auth-user.decorator';
import { JwtDecoded } from 'src/core/base/module/use-case.base';
import { CreateScript } from '../use-case/create-script.use-case';
import { ListScripts } from '../use-case/list-scripts.use-case';
import { UpdateScript } from '../use-case/update-script.use-case';
import { DeleteScript } from '../use-case/delete-script.use-case';
import { CreateScriptRequestDto } from './dto/create-script.request.dto';
import { UpdateScriptRequestDto } from './dto/update-script.request.dto';

@Controller('v1/scripts')
export class ScriptController {
  constructor(
    private readonly createScript: CreateScript,
    private readonly listScripts: ListScripts,
    private readonly updateScript: UpdateScript,
    private readonly deleteScript: DeleteScript,
  ) {}

  @SecurePost()
  async create(
    @Body() body: CreateScriptRequestDto,
    @AuthUser() user: JwtDecoded,
  ) {
    return this.createScript.execute({
      ...body,
      created_by: user.user_id,
    });
  }

  @SecureGet()
  async findAll(
    @Query('database_id') database_id: string,
    @Query('db_name') db_name: string,
  ) {
    return this.listScripts.execute({ database_id, db_name });
  }

  @SecurePut(':_id')
  async update(
    @Param('_id') _id: string,
    @Body() body: UpdateScriptRequestDto,
  ) {
    return this.updateScript.execute({ _id, ...body });
  }

  @SecureDelete(':_id')
  async delete(@Param('_id') _id: string) {
    return this.deleteScript.execute({ _id });
  }
}
