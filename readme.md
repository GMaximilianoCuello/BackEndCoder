# Backend (II) - Proyecto Final

## TECNOLOGIAS USADAS

- NODE.JS
- MONGOOSE
- EXPRESS
- ROUTER
- HANDLEBARS
- PASSPORT

## REQUISITOS

- MongoDB
- NODE.JS v14 o superior

## Instalación del proyecto

Paso 1
* Clonar repositorio o descargar los archivos.

```bash
git clone https://github.com/GMaximilianoCuello/BackEndCoder.git
```
Paso 2
* instalar dependencias.

```bash
npm install
```

Paso 3 Configurar las variables
* Las variables de entornos las encontraras en el archivo **.env.examble**.

Paso 4 
* Ejecuta el proyecto.

```bash
npm start
```

## Funciones

### 1 - Registro y login

Los usuarios pueden registrarse y autenticarse con su correo y contraseña.

- **Ruta para Registrarse**: /register
- **Ruta para Login**: /login

##### (En mongoDB en la coleccion de users, cambiar el role directamente a admin) 

### 2 - Current

- Los **usuarios** podran ver su perfil junto a su carrito.

- Ademas, podran ver los productos disponibles aptos para agregar al carrito.

- El carrito se actualiza dependiendo del producto que haya elegido. 

### 3 - Compra del carrito

- Los usuarios pueden completar su compra mediante el boton "Comprar Carrito".

- Una vez realizada la compra, se enviara un ticket con los detalles de la compra al email del usuario.

### 3 - Administración de productos (admin)

- Los administradores podran crear productos que se guardan en la base de datos, los campos requeridos apareceran en forma de imputs.

- Rutas de products:
    * Todos los productos: get /api/products/admin/crud
    * Obtener producto por id: get /api/products/:pid
    * Agregar producto: post /api/products
    * Actualizar productos: post /api/products/update/:pid (funcion put en handlebars)
    * Borrar producto: post /api/products/delete/:pid (funcion delete en handlebars)