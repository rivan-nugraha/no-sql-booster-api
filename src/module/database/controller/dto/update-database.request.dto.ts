import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';
import { UpdateDatabaseRequestProps } from '../../contract/database.request.contract';

export class UpdateDatabaseRequestDto
  implements UpdateDatabaseRequestProps
{
  @IsOptionalString()
  name?: string;

  @IsOptionalString()
  uri?: string;

  @IsOptionalString()
  description?: string;

  @IsOptionalString()
  icon?: string;
}
