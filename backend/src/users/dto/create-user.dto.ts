import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @IsString({ message: 'Nombre no válido' })
  @IsNotEmpty({ message: 'El nombre no puede ir vacio' })
  name: string;

  @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @IsString({ message: 'Password no válido' })
  @IsNotEmpty({ message: 'El password no puede ir vaio' })
  @MinLength(8, { message: 'El password debe tener al menos 8 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  isActive?: boolean;
}
