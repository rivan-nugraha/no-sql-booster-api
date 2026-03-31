import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';
import { CreateDatabaseRequestProps } from '../../contract/database.request.contract';

export class CreateDatabaseRequestDto
  implements CreateDatabaseRequestProps
{
  @IsRequiredString()
  name: string;

  @IsRequiredString()
  uri: string;

  @IsOptionalString()
  description?: string;

  @IsOptionalString()
  icon?: string;
}
