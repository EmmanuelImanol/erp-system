import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { checkPassword } from 'src/utils/auth';
import { generateJWT } from 'src/utils/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('El email ya está registrado');
    }

    await this.usersService.createAccount({ email, name, password });
    return { message: 'Usuario registrado correctamente' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password Incorrecto');
    }

    const secret: string = this.configService.get('JWT_SECRET')!;
    const token = generateJWT(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
    );

    return { token };
  }
}
