const express = require("express")
const router = express.Router()
const fs = require(`fs`)


router.get('/', (req, res) => {
    
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

router.get('/:pid', (req, res) => {

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

router.post('/', (req, res) => {

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

router.put('/:pid', (req, res) => {

    const productId = parseInt(req.params.pid)

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Error en el servidor' })
        }
        
        let productos = JSON.parse(data)
        let productoActualizado = null

        
        productos = productos.map(producto => {
            if (producto.id === productId) {
                
                const { nombre, descripcion, codigo, precio, status, stock, categoria } = req.body

                producto.nombre = nombre || producto.nombre
                producto.descripcion = descripcion || producto.descripcion
                producto.codigo = codigo || producto.codigo
                producto.precio = precio || producto.precio
                producto.status = status || producto.status
                producto.stock = stock || producto.stock
                producto.categoria = categoria || producto.categoria

                productoActualizado = producto; 
            }
            return producto;
        })

        if (productoActualizado) {
            
            fs.writeFile('productos.json', JSON.stringify(productos, null, 2), err => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: 'Error al actualizar el producto en el archivo' })
                }
                
                res.json(productoActualizado)
            })
        } else {
            res.status(404).json({ message: 'Producto no encontrado' })
        }
    })
});



router.delete('/:pid', (req, res) => {

    const productId = parseInt(req.params.pid); 

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Error en el servidor' })
        }
        
        let productos = JSON.parse(data)
        productos = productos.filter(producto => producto.id !== productId)

        fs.writeFile('productos.json', JSON.stringify(productos, null, 2), err => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Error al eliminar el producto' })
            }
            
            res.json({ exito: "El producto fue eliminado" })
        })
    })
});


module.exports = router;