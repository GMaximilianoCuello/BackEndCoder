import express from "express";
import productModel from "../models/products.model.js"

const router = express.Router()


router.get('/', async (req, res) => {

    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const searchQuery = query ? { $or: [{ nombre: { $regex: query, $options: 'i' } }, { categoria: { $regex: query, $options: 'i' } }] } : {};

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { precio: sort === 'asc' ? 1 : -1 } : {}
        };

        const result = await productModel.paginate(searchQuery, options);

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.page - 1 : null,
            nextPage: result.hasNextPage ? result.page + 1 : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.page + 1}&sort=${sort}&query=${query}` : null
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {

    try {

        const producto = await productModel.findById(req.params.pid);

        if (producto) {
            res.json(producto);

        } else {

            res.status(404).json({ Ups: 'Producto no encontrado' });
        }

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

const ioHelp = (io) => {

    router.post('/', async (req, res) => {

        try {
            const { nombre, descripcion, codigo, precio, status, stock, categoria } = req.body;
            const nuevoProducto = await productModel.create({ nombre, descripcion, codigo, precio, status, stock, categoria });

            io.emit('nuevoProducto', nuevoProducto);
            res.json(nuevoProducto);

        } catch (error) {

            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    });

    router.put('/:pid', async (req, res) => {
        try {

            const { nombre, descripcion, codigo, precio, status, stock, categoria } = req.body;

            const productoActualizado = await productModel.findByIdAndUpdate(req.params.pid, {
                nombre,
                descripcion,
                codigo,
                precio,
                status,
                stock,
                categoria
            }, { new: true });

            if (productoActualizado) {

                io.emit('productoActualizado', productoActualizado);
                res.json(productoActualizado);

            } else {

                res.status(404).json({ message: 'Producto no encontrado' });
            }

        } catch (error) {

            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    });

    router.delete('/:pid', async (req, res) => {

        try {
            const productoEliminado = await productModel.findByIdAndDelete(req.params.pid);

            if (productoEliminado) {

                io.emit('productoEliminado', { id: req.params.pid });
                res.json({ exito: "El producto fue eliminado" });

            } else {

                res.status(404).json({ error: 'Producto no encontrado' });
            }

        } catch (error) {

            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    });

    return router;
}

export default ioHelp;