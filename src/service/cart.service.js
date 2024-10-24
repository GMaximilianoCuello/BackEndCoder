import cartDAO from "../dao/cart.dao.js";
import productModel from "../models/products.model.js";

class CartService {
  async createCart(userId, products = []) {
    return await cartDAO.createCart(userId, products);
  }
  
  async getCartById(cid) {
    return await cartDAO.getCartById(cid)
  }

  async addProductToCart(cid, pid) {
    const product = await productModel.findById(pid);
    if (!product) throw new Error('Producto no encontrado');
    return await cartDAO.addProductToCart(cid, product);
  }

  async deleteProductFromCart(cid, pid) {
    return await cartDAO.deleteProductFromCart(cid, pid);
  }

  async deleteAllProductsFromCart(cid) {
    return await cartDAO.deleteAllProductsFromCart(cid);
  }

  async finalizePurchase(cid) {
    const cart = await cartDAO.getCartById(cid).populate("products.producto");
    if (!cart || cart.products.length === 0) return null;
  
    await cartDAO.deleteAllProductsFromCart(cid);
    return cart
  }
  
}

export default new CartService();

