import express from "express"
import handlebars from "express-handlebars";
import  __dirname from "./utils/utils.js";
import path from "path";
import http from "http"
import { Server } from 'socket.io';

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from './routes/views.router.js'

const app = express()
const PORT = 8080



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(`/api/products/`, productsRouter)
app.use(`/api/carts/`, cartsRouter)
app.use('/', viewsRouter);

// Handlebars
app.engine(`handlebars`, handlebars.engine());
app.set(`views`, path.join( __dirname, "views"));
app.set(`view engine`, `handlebars`);


app.use(express.static(__dirname + `public`))

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on(`connection`, (socket) =>{
    console.log("Nuevo cliente conectado")
    
    socket.on('info', data => {
        console.log(`la data es ${data}`);
    });

    socket.on('dataProducto', data => {
        console.log(`Producto recibido:`, data);
        io.emit(`dataProducto`, data)
    });

    socket.on('eliminarProducto', data => {
        console.log(`Eliminar Producto:`, data);
        io.emit(`productoEliminado`, data)
    });
})

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})