<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Stack usado

*Nest

*Postgres


# Ejecutar en desarrollo
1. Clonar el repositorio y asignamos al nuevo repo ya creado en git
```bash
git clone https://github.com/martinprado1000/Nest-04-ecommerce.git nuevoNombre

git remote set-url origin https://github.com/martinprado1000/nuevoNombre.git
```

2. Tener Nest CLI instalado:
```bash
npm i -g @nest/cli
```

3. Levantar la base de datos

```bash
docker-compose up -d
```

4. Renombrar el archivo __.env.template__ por __.env__ y llenar las variables de entorno.

5. Ejecutar en desarrollo
```bash
# Esto ejecuta el archivo docker.compose.yml
$ npm run star:dev

# Ejecutar seed de Pokemons ,inserta multiples datos.
http://localhost:3000/seed/pokemons/multiplesRegistros2
```


# Construir y ejecutar para producción
```bash
# Construir
$ npm run build

# Ejecutar
$ npm run start:prod
```

# Construir y ejecutar para producción la app y la base en mongo DOCKERIZADO

1. Renombrar el archivo __.env.template__ por __.env.prod__ y llenar las variables de entorno.

2. Crear las imagenes
```bash
# Usamos el docker-compose.prod.yaml y el .env.prod que son los de produccón.

docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

# Si las imagenes ya fueron creadas y solo necesitamos levantar ejecutar:
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```


### Esta aplicacion es para administrar prdcutos.
Configuraciones:

Entidades: productos

.env  .env.template  .env.prod.

ConfigModule,ConfigService,Joi.

Solo configuración de la db en docker.







