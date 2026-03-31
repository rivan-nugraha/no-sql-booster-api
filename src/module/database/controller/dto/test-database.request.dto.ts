import { IsRequiredString } from 'src/core/decorator/required-string.decorator';

export class TestDatabaseRequestDto {
  @IsRequiredString()
  uri: string;
}
