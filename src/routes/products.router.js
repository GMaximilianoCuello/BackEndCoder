const express = require("express")
const router = express.Router()
const fs = require(`fs`)


router.get('/api/products', (req, res) => {
    
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const productos = JSON.parse(data);
        const limit = req.query.limit;

        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    });
});

router.get('/api/products/:pid', (req, res) => {

    const productId = req.params.pid;

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const productos = JSON.parse(data);
        const producto = productos.find(producto => producto.id === parseInt(productId));

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ Ups: 'Producto no encontrado' });
        }
    });
});

router.post('/api/products', (req, res) => {

    const { nombre, descripcion, codigo , precio, status, stock, categoria } = req.body;

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const productos = JSON.parse(data);
        const id = productos.length + 1;
        const nuevoProducto = { id, nombre, descripcion, codigo, precio, status, stock, categoria };

        productos.push(nuevoProducto);

        fs.writeFile('productos.json', JSON.stringify(productos, null, 2), err => {

            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(nuevoProducto);
        });
    });
});

router.put(`/api/products/:pid`, (req,res) => {
    
    const productId = parseInt(req.params.id)
    
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const productos = JSON.parse(data);
        const producto = productos.find((producto) => producto.id === parseInt(productId))

        if(producto){
            const {nombre, descripcion, codigo , precio, status, stock, categoria} = req.body
            producto = {nombre, descripcion, codigo , precio, status, stock, categoria}
            res.json(producto)
        }else {
            res.status(404).json({ ups: "Producto no encontrado"})
        }
    });
    
});

module.exports = router