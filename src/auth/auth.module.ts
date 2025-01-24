// npm i bcrypt
// npm i -D @types/bcrypt
// npm install @nestjs/passport passport
// npm install @nestjs/jwt passport-jwt
// npm i -D @types/passport-jwt

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn:'2h'
          }
        }
      }
    })
    // JwtModule.register({   // Usamos la config de arriba porque es async para asegurarnos de levatar las variables de entorno.
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '2h',
    //   },
    // }),

  ],

  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule], // Los exporto para el caso que necesite validar algo de jwt en otro lado.
})
export class AuthModule {}
