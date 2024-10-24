import productDAO from "../dao/product.dao.js";

class ProductService {
    async createProduct(productData) {
        return await productDAO.createProduct(productData);
    }

    async getAllProducts() {
        return await productDAO.getAllProducts();
    }

    async getProductById(id) {
        return await productDAO.getProductById(id);
    }

    async updateProduct(id, updatedData) {
        return await productDAO.updateProduct(id, updatedData);
    }

    async deleteProduct(pid) {
        return await productDAO.deleteProduct(pid);
    }
}

export default new ProductService();
