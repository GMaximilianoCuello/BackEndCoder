import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "Productos"

const productSchema = new mongoose.Schema({
    nombre:{type: String, required: true},
    descripcion:{type: String, required: true, max:100},
    codigo:{type: String, required: true, max:10},
    precio:{type: Number, required: true},
    status:{type: Boolean, default: true},
    stock:{type: String, required: true},
    categoria:{type: String, required: true}
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productsCollection, productSchema)

export default productModel
