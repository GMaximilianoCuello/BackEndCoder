import express from "express";
import userModel from '../models/user.model.js';
import {authorization} from '../middleware/auth.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { passportCall } from "../utils/utils.js";

const router = express.Router();

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

        let token = jwt.sign({ id: user._id, role:"user" }, 'secretocoder', { expiresIn: '24h' })

        res.cookie('jwt', token, { httpOnly: true, secure: false })

        return res.redirect("/auth/profile")

    } catch (err) {
        return res.status(500).json({ message: 'Error en el servidor' })
    }
});

router.get("/profile", passportCall("jwt"), authorization('user') ,(req, res) => {
    res.render("profile", { user: req.user })
});

  

router.get('/logout', (req, res) => {

    res.clearCookie('jwt'); 
    res.redirect('/login');
});

export default router;
