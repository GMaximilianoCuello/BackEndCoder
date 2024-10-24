import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
    products: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: `Productos`,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            default: 1
        }
    }]
})

const cartsModel = mongoose.model(`carts`, cartSchema)

export default cartsModel
