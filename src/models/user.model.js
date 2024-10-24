import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' }
});

const userModel = mongoose.model(`user`, userSchema);

export default userModel;