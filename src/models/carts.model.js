import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: `Productos`,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            default: 0
        }
    }]
})

const cartsModel = mongoose.model(`carts`, cartSchema)

export default cartsModel
