import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScriptRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  database_id?: string;

  @IsString()
  @IsOptional()
  db_name?: string;

  @IsString()
  @IsNotEmpty()
  script: string;
}
