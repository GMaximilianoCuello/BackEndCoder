import express from "express"
import handlebars from "express-handlebars";
import  __dirname from "./utils/utils.js";
import path from "path";
import http from "http"
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";


// --- Rutas ---
import productsRouter from './routes/products.router.js';
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from './routes/views.router.js'
import authRouter from './routes/auth.router.js'

const app = express()
const PORT = 8080

connectDB()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(passport.initialize())

app.use('/auth', authRouter)
app.use("/api/products", productsRouter )
app.use(`/api/carts`, cartsRouter)
app.use('/', viewsRouter);

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

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
