import { GetPaginationDto } from 'src/core/base/http/get-pagination.dto.base';
import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';

export class ListDocumentsQueryDto extends GetPaginationDto {
  @IsOptionalString()
  filter?: string;
}
