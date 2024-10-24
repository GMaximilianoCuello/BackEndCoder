import productModel from "../models/products.model.js";

class ProductDAO {
    async createProduct(product) {
        return await productModel.create(product);
    }

    async getAllProducts() {
        return await productModel.find()
    }

    async getProductById(id) {
        return await productModel.findById(id);
    }

    async updateProduct(id, updatedData) {
        return await productModel.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async deleteProduct(id) {
        return await productModel.findByIdAndDelete(id);
    }


}

export default new ProductDAO();
