import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/utils/auth';

// Tipo reutilizable para usuario sin contraseña
type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createAccount(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    const { email, password, name, role, isActive } = createUserDto;

    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = this.usersRepository.create({
      name,
      email,
      password: await hashPassword(password),
      role,
      isActive,
    });

    await this.usersRepository.save(user);
    return { message: 'Usuario registrado correctamente' };
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Devuelve User completo (con password) porque auth.service lo necesita para verificar
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    await this.findById(id); // lanza NotFoundException si no existe

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    await this.usersRepository.update(id, updateUserDto);
    return { message: 'Usuario actualizado correctamente' };
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id); // lanza NotFoundException si no existe

    await this.usersRepository.delete(id);
    return { message: 'Usuario eliminado correctamente' };
  }
}
