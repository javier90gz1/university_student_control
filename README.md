# university_student_control

## Instalación
***
La base de datos debe ser mysql
```
Para instalar la app debe tener instalado npm o yarn en dependencia del que prefiera
Debe clonar la app del repositorio y ejecutar los siguientes pasos
primero con el servidor y luego con el cliente.
```
$ git clone https://github.com/javier90gz1/university_student_control.git
$ cd ../university_student_control/backend
$ npm install o yarn 
$ npm start o yarn start

```
debe crear un fichero .env y configurar los sigientes parámetros:
$HOST=["localhost"]
$USER= ["usuario de la bd"]
$PASSWORD=["contraseña de la bd"]
$ADMIN_PASSWORD=["contraseña del user admin"]
$DB= ['nombre de DB']
$PORT= ["puerto"]
```
```
Luego de instalar los paquetes de npm del servidor debe hacerlo con el cliente
```
$ cd ../university_student_control/frontend
$ npm install o yarn 
$ npm start o yarn start
```
Una vez instalado poner en el package.json en el proxy la direccion del backend para que se comuniquen
ejemplo:
$"proxy": "http://localhost:3000"

