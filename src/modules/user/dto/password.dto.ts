import { IsNotEmpty, Length } from 'class-validator';

export class PasswordDto {
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
