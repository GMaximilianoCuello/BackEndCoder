import express from 'express';
import productController from "../controllers/products.controllers.js";

const router = express.Router();

router.get('/admin/crud', productController.getAllProducts);
router.get('/:pid', productController.getProductById);

router.post('/', productController.createProduct);
router.post('/update/:pid', productController.updateProduct)
router.post('/delete/:pid', productController.deleteProduct)


export default router;