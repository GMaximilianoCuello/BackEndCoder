const express = require("express");
const router = express.Router();
const fs = require('fs');

// Crear carrito
router.post('/', (req, res) => {
    
    const { productos } = req.body;

    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        let carts = [];

        try {
            carts = JSON.parse(data);

        } catch (error) {

            console.error(error);
            return res.status(500).json({ error: 'Error al analizar el archivo JSON' });
        }

        const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

        const newCart = {
            id: newId,
            productos
        };

        carts.push(newCart);

        fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), err => {
            
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            res.json(newCart);
        });
    });
});

// Obtener un carrito por id
router.get('/:cid', (req, res) => {

    const cartId = parseInt(req.params.cid);

    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const carritos = JSON.parse(data);
        const carrito = carritos.find(carrito => carrito.id === cartId);

        if (carrito) {
            res.json(carrito);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });
});

// Agregar productos
router.post('/:cid/product/:pid', (req, res) => {
    
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const añadirCantidad = 1;

    fs.readFile('productos.json', 'utf8', (err, productosData) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor al leer productos' });
        }

        const productos = JSON.parse(productosData);
        const product = productos.find(producto => producto.id === productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        fs.readFile('carrito.json', 'utf8', (err, Data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error en el servidor al leer carrito' });
            }

            const carritos = JSON.parse(Data);
            const cartIndex = carritos.findIndex(carrito => carrito.id === cartId);

            if (cartIndex !== -1) {
                
                const productoExistente = carritos[cartIndex].productos.findIndex(item => item.product === productId);

                if (productoExistente !== -1) {
                    
                    carritos[cartIndex].productos[productoExistente].quantity += añadirCantidad;
                } else {
                    
                    carritos[cartIndex].productos.push({
                        product: productId,
                        quantity: añadirCantidad
                    });
                }

                fs.writeFile('carrito.json', JSON.stringify(carritos, null, 2), err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Error en el servidor al escribir carrito' });
                    }

                    res.status(200).json({ success: 'Producto añadido correctamente al carrito' });
                });
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        });
    });
});

// Eliminar un carrito
router.delete('/:cid', (req, res) => {

    const cartId = parseInt(req.params.cid);

    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor al leer carrito' });
        }

        let carritos = [];

        try {
            carritos = JSON.parse(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al analizar el archivo JSON' });
        }

        const cartIndex = carritos.findIndex(carrito => carrito.id === cartId);

        if (cartIndex !== -1) {

            carritos.splice(cartIndex, 1);

            fs.writeFile('carrito.json', JSON.stringify(carritos, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error en el servidor al escribir carrito' });
                }

                res.status(200).json({ success: 'Carrito eliminado correctamente' });
            });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });
});

module.exports = router;
