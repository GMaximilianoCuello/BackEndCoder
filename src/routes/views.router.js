import express from 'express'
import { passportCall } from "../utils/utils.js";
import {authorization} from '../middleware/auth.js'
import productController from '../controllers/products.controllers.js';

const router = express.Router() 

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/current', (req, res) => {
    res.render('current');
});

router.get("/admin/crud",passportCall("jwt"),authorization("admin"),async (req, res) => {
    
    try {
        const products = await productController.getAllProductsForView();
        res.render('adminCrud', { products });
        
    } catch (error) {
        console.error('Error al cargar productos en adminCrud:', error);
        res.status(500).send('Error al cargar la página de administración');
    }
});


export default router;