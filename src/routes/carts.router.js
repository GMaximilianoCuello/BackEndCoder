import express from 'express';
import cartController from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/', cartController.createCart);  
router.get('/:cid', cartController.getCartById);  
router.post('/:cid/products/:pid', cartController.addProductToCart); 
router.post('/:cid/products/:pid/delete', cartController.deleteProductFromCart);  
router.delete('/:cid', cartController.deleteAllProductsFromCart);  
router.post('/:cid/purchase', cartController.purchaseCart);  

export default router;

