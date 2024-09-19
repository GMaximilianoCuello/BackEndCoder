import express from "express"
import handlebars from "express-handlebars";
import  __dirname from "./utils/utils.js";
import path from "path";
import http from "http"
import { Server } from 'socket.io';
import productModel from "./models/products.model.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";


// --- Rutas ---
import ioHelp from './routes/products.router.js';
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from './routes/views.router.js'
import authRouter from './routes/auth.router.js'

const app = express()
const PORT = 8080

mongoose.connect("mongodb+srv://maxicuello:lucia2014@codercluster.cixh9.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster")
  .then(()=> {
    console.log("conectado a la base de datos");
  })
  .catch(error => {
     console.error("Error al conectar con la base de datos", error);
  })

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(passport.initialize())

app.use(`/api/carts/`, cartsRouter)
app.use('/', viewsRouter);
app.use('/auth', authRouter)

// Handlebars
app.engine('handlebars',handlebars.engine({
      defaultLayout: 'main',
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    })
);
app.set(`views`, path.join( __dirname, "views"));
app.set(`view engine`, `handlebars`);


app.use(express.static(path.join(__dirname, `public`)));

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use("/api/products", ioHelp(io))

io.on(`connection`, async (socket) =>{
    console.log("Nuevo cliente conectado")
    
    socket.on('info', data => {
        console.log(`la data es ${data}`);
    });

    socket.on('dataProducto', data => {
        console.log(`Producto recibido:`, data);
        io.emit(`dataProducto`, data)
    });

    socket.on('solicitarProductos', async () => {
        try {
            const productos = await productModel.find();
            io.emit('dataProducto', productos);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    });

    socket.on('cartUpdated', (cart) => {
        io.emit('cartUpdated', cart);
    });

    socket.on('eliminarProducto', data => {
        console.log(`Eliminar Producto:`, data);
        io.emit(`productoEliminado`, data)
    });

    socket.on('nuevoProducto', data => {
        io.emit('nuevoProducto', data);
    });

    socket.on('productoActualizado', data => {
        io.emit('productoActualizado', data);
    });
})


httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
