import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt'; // Importamos jwt

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService // Este es el modulo de jwt que interactua con el jwtModulo creado por nosotros
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginAuthDto: LoginUserDto) {
    
      const { password, email } = loginAuthDto;

      //const user = await this.userRepository.findOneBy({ email });
      const user = await this.userRepository.findOne({
        // Lo hago de esta forma poruqe en el entity le indique que nunca retorne la password cuando hagna un findOneBy por seguridad.
        where: { email },
        select: { id:true, email: true, password: true },
      });

      if (!user)
        throw new UnauthorizedException('Credential are not valid (email)');

      if ( !bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credential are not valid (password)');

      // Si la registración fue correcta retornamos el usuario y el token.  
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
  }

  // Este es nuestro metodo que genera el token
  private getJwtToken ( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload )
    return token;
  }

  private handleDBErrors(error: any): never {
    // Esta funcion retorna never porque nunca va a retornar nada. Solo puede lanzar una axection.
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
