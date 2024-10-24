import express from "express";
import userModel from '../models/user.model.js';
import {authorization} from '../middleware/auth.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { passportCall } from "../utils/utils.js";
import cartService from '../service/cart.service.js';
import productModel from '../models/products.model.js';
import cartsModel from "../models/carts.model.js";

const router = express.Router();
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body;

    try {

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Este correo ya está registrado' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        res.redirect('/login');

    } catch (error) {
        console.error('Error al registrar el usuario', error);
        res.status(500).send({ error: 'Hubo un problema con el registro' });
    }
});

router.post('/login', async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Email o contraseña incorrecta' })
        }

        const tokenPayload = { id: user._id, role: user.role };
        let token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
        res.cookie('jwt', token, { httpOnly: true, secure: false });

        if (user.role === 'admin') {
            return res.redirect("/admin/crud");
        } else {
            return res.redirect("/auth/current");
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error en el servidor' })
    }
});

router.get("/current", passportCall("jwt"), authorization('user'), async (req, res) => {
    try {
      const user = req.user;

      let cart;
        if (!user.cartId) {
        cart = await cartsModel.create({ user: user._id, products: [] });
        user.cartId = cart._id;
        await user.save();

        } else {
        cart = await cartService.getCartById(user.cartId);
        }

      const products = await productModel.find();
  
      res.render("current", { user, cart, products });
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
      res.status(500).json({ error: "Error al obtener el perfil del usuario" });
    }
  });

router.get('/logout', (req, res) => {

    res.clearCookie('jwt'); 
    res.redirect('/login');
});

export default router;
