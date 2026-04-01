import { IsOptional, IsString } from 'class-validator';

export class UpdateScriptRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  script?: string;
}
