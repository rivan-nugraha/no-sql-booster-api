import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScriptRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  database_id: string;

  @IsString()
  @IsNotEmpty()
  db_name: string;

  @IsString()
  @IsNotEmpty()
  script: string;
}
