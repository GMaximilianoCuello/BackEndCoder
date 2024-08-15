import express from "express";
import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

const router = express.Router();

router.post('/', async (req, res) => {

    try {

        const { productos = [] } = req.body;
        const nuevoCarrito = await cartModel.create({ productos });
        res.json(nuevoCarrito);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.get('/', async (req, res) => {

    try {

        const carrito = await cartModel.findOne().populate('products.producto');

        if (carrito) {
            res.json(carrito);
        } else {

            res.status(404).json({ error: 'No se encontró ningún carrito.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


router.get('/:cid', async (req, res) => {

    try {
        const carrito = await cartModel.findById(req.params.cid).populate('products.producto');

        if (carrito) {
            
            res.json(carrito);
        } else {

            res.status(404).json({ error: 'Carrito no encontrado' });
        }

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carrito = await cartModel.findById(req.params.cid);

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const producto = await productModel.findById(req.params.pid);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productoExistente = carrito.products.find(p => p.producto.toString() === req.params.pid);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.products.push({ producto: req.params.pid, cantidad: 1 });
        }

        await carrito.save();
        res.json({ success: 'Producto añadido correctamente al carrito' });

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {

    try {
        const carrito = await cartModel.findById(req.params.cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carrito.products = carrito.products.filter(p => p.producto.toString() !== req.params.pid);
        await carrito.save();

        res.json({ success: 'Producto eliminado del carrito correctamente' });

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { productos } = req.body;
        const carrito = await cartModel.findByIdAndUpdate(req.params.cid, { productos }, { new: true }).populate('products.producto');

        if (carrito) {
            res.json(carrito);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cantidad } = req.body;
        const carrito = await cartModel.findById(req.params.cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const producto = carrito.products.find(p => p.producto.toString() === req.params.pid);

        if (producto) {
            producto.cantidad = cantidad;
            await carrito.save();
            res.json({ success: 'Cantidad de producto actualizada correctamente' });

        } else {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.delete('/:cid', async (req, res) => {

    try {
        const carrito = await cartModel.findById(req.params.cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carrito.products = [];
        await carrito.save();

        res.json({ success: 'Todos los productos eliminados del carrito correctamente' });

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;
