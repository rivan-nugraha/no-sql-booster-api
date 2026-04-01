import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RunScriptRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000, { message: 'Script too long (max 10k chars).' })
  script: string;

  // Optional hard cap to avoid huge result sets
  limit?: number;
}
