import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

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
