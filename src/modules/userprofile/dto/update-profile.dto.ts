import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message:
      'Username must contain only letters, numbers, dots and underscores',
  })
  username: string;

  @IsDateString()
  @IsOptional()
  dob: Date;
}
