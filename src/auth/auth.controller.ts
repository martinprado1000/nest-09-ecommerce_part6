import { request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Es el Guard que trabaja con passport

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

import {
  GetUser,
  EmailTest,
  HeadersTest,
  RoleProtected,
  Auth,
} from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Revalida el token que nos envian y lo renueva. Para el caso que el usuario renueve la aplicacion y le siga asignando un token.
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards(
    // UseGuards: Incorpora una lista de Guards. Dentro de aca incorporamos guards que puden ser llamados con el @ o no, eso depende del tipo de guard
    AuthGuard(), // AuthGuard de passport hace la validacion del token y nuestra estrategia. *** Y agrega automaticamente user al contexto y al request. ***
  )
  testingPrivateRoute(
    // ** DECORADORES DE PARAMETROS ** No se pueden generar decoradore de parametro con: nest g de xxx. Eso es para decoradores globales o de metodos.
    // Aca se llaman los decoradores de parametros.
    // @Req() request:Express.Request,          // Asi podriamos acceder a la request pero lo hacemos de la siguiente manera
    @GetUser() user: User, // Decorador pers de parametros que extre el usuario del contexto. En el decorador explicacion de porque esxtraemos aca el req.
    @EmailTest('email') email: User, // Decorador pers de practica, si paso el parametro email responde una cosa u otra. Podria pasar un arreglo si quiero.
    @HeadersTest('email') headersTest: string[], // Decorador pers de practica, obtengo los headers
    @Headers() headers: IncomingHttpHeaders, // Decorador propio de nest para obtener los headers
  ) {
    //console.log(user)
    //console.log(email)
    //console.log(headersTest)
    //console.log(headers)
    return {
      ok: true,
      messaage: 'Route PRIVATE OK',
      user,
    };
  }

  @Get('private2')
  // ** DECORADORES DE METODO **
  //@SetMetadata('rolesTest',['admin','super-admin'])     // Decorador de practica. Este deco de metadata es propio de nest, Es para agregar informacion y luego accederla desde un decorador. Accedemos a esta metadata en el guard UserRoleGuard para chequear el rol de usuario.
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)  // Decorador pers, le pasamos los roles validos para esta ruta. Es lo mismo de lo de arriba pero ahora le pasamos los argumento obtenidos desde un enum y la metadata se agrega a travez de este decorador personalizado.
  @UseGuards(
    AuthGuard(),    // Este Guard es el de passport y se instacia por eso se lo llama con (), los guards pers como los de acontinuacion no se instacian.
    UserRoleGuard,  // Llamamos a nuestro guard personalizado donde donde permite seguir a la ruta segun la metadata ingresada en el  @RoleProtected.
  )
  testingPrivateRoute2() {
    return {
      ok: true,
      messaage: 'Route2 PRIVATE OK',
    };
  }

  // En esta ruta reemplazamos el decorador de @RoleProtected  y  @UseGuards(AuthGuard(), UserRoleGuard,)
  // por el decorador personalizado que une los 2.
  // por lo tanto este hace la validacion de passport, el guard de passport y la autorizacion de roles.
  @Get('private3')
  //@Auth()  // Si lo dejara vacio podria cualquier rol acceder paro si o si tiene que estar autenticado porque esto involucra el guar de jwt.
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
