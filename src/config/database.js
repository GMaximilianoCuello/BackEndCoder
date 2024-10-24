import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const MONGODB_URL = process.env.MONGODB_URL

const connectDB = async () => {

    await mongoose.connect(MONGODB_URL)
    .then(()=> {
      console.log("conectado a la base de datos");
    })
    .catch(error => {
        console.error("Error al conectar con la base de datos", error);
     })
    
}

export default connectDB