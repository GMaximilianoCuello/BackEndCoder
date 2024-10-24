import cartModel from "../models/carts.model.js";
import userModel from "../models/user.model.js";

class CartDAO {
  async createCart(userId, products) {
    return await cartModel.create({ user: userId, products });
  }
  
  
  async getCartById(cid) {
    return await cartModel
      .findById(cid).populate({ path: "user", model: userModel }).populate({path: 'products.producto', model: 'Productos'});
  }
  

  async addProductToCart(cid, product) {
    const cart = await cartModel.findById(cid);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.producto.toString() === product._id.toString());
    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      cart.products.push({ producto: product._id, cantidad: 1 });
    }
    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await cartModel.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.producto.toString() !== pid);
    await cart.save();
    return cart;
  }

  async deleteAllProductsFromCart(cid) {
    const cart = await cartModel.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}

export default new CartDAO();
