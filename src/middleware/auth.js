import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const isAuthenticated = (req, res, next) => {

    const token = req.cookies.jwt

    if (!token) {
        return res.redirect('/login');
    }
    
    jwt.verify(token, JWT_SECRET , (error, decoded) => {

        if (error) {

            return res.redirect('/login');
        }
        req.user = decoded;
        next();
    });
};


export const isNotAuthenticated = (req, res, next) => {

    const token = req.cookies.jwt

    if (token) {
        return res.redirect('/current')
    } 

    next()
};


export const authorization = role => (req, res, next) => {

    if (!req.user) return res.status(401).send({ error: 'Usuario no autorizado' });

    if (req.user.role !== role) return res.status(403).send({ error: 'Acceso denegado: no eres administrador.' });
    
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ error: 'Acceso denegado: No eres administrador.' });
    }
};