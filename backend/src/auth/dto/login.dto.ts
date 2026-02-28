import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @IsString({ message: 'Password no válido' })
  @MinLength(8)
  password: string;
}
