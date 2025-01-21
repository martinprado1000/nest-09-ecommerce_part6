<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Nest-04-ecommerce

## Stack usado

*Nest

*Postgres


# Clonar el repositorio para editar.
-Clonar el repositorio y asignamos al nuevo repo ya creado en git
```bash
#Recordar cambiar el nombre del proyecto en package.json

git clone https://github.com/martinprado1000/nest-05-ecommerce_part2.git nuevoNombre

git remote set-url origin https://github.com/martinprado1000/nuevoNombre.git

git install

```
# Ejecutar en desarrollo.
1. Clonar el repositorio.
2. Tener Nest CLI instalado:
```bash
npm i -g @nest/cli
```

3. Levantar la base de datos

```bash
docker-compose up -d
#Para Postgres recordar crear la base de datos a mono porque no la crea sola
```

4. Renombrar el archivo __.env.template__ por __.env__ y llenar las variables de entorno e instalar las dependencias:
```bash
#Instalar dependencias
git install
```

5. Ejecutar en desarrollo
```bash
# Esto ejecuta el archivo docker.compose.yml
$ npm run star:dev

# Ejecutar seed de Productos, elimina los datos e inserta multiples datos.
http://localhost:3000/api/seed
```


# Construir y ejecutar para producción
```bash
# Construir
$ npm run build

# Ejecutar
$ npm run start:prod
```

### Esta aplicacion es para administrar prodcutos.
Configuraciones:

* Entidades: productos, seed

* .env  .env.template  .env.prod.

* ConfigModule,ConfigService,Joi.

* Paginación.

* Solo configuración de la db en docker.

--Es la parte 2 del ecommerce.--

* Aplanamos el los nombres de retorno de las url.

* Creamos una segunda tabla relacionada para las imagenes, la eliminacion se hizo con queryRunner ( elimina si todo salio bien sino hace un rollback)

* Subimos archivo a file sistem, carpeta static. ** Implementa archivo .gitkeep (Es para que git le de seguimiento a esa carpeta aunque este vacia)**









