const express = require("express")
const router = express.Router()
const fs = require(`fs`)


router.post('/api/carts', (req, res) => {

    const { productsId, productos } = req.body;

    if (productsId && productos) {
        fs.readFile('carrito.json', 'utf8', (err, data) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            const carritos = JSON.parse(data);

            carritos.push({ productsId, productos });

            fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), err => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error en el servidor' });
                }

                res.json({ productsId, productos });
            });
        });
    } else {
        res.status(400).json({ error: 'ID y producto requeridos' });
    }
});


router.get('/api/carts/:cid', (req, res) => {

    const productsId = req.params.cid;

    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const carritos = JSON.parse(data);

        const carrito = carritos.find(carrito => carrito.id === productsId);

        if (carrito) {
            res.json(carrito);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });
});


router.post('/api/carts/:cid/product/:pid', (req, res) => {

    const carritoId= req.params.cid;
    const productId = req.params.pid;
    const añadirProducto = {
        product: productId,
        quantity: 1
    };

    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const carritos = JSON.parse(data);

        const cartIndex = carritos.findIndex(carrito => carrito.id === carritoId);

        if (cartIndex !== -1) {

            carts[cartIndex].products.push(añadirProducto);
            fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error en el sistema' });
                }

                res.status(200).json({ Success: 'Producto añadido correctamente' });
            });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });
});


module.exports = router;