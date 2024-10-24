import productService from "../service/products.service.js";

class ProductController {
    async createProduct(req, res) {
        const productData = req.body;
        await productService.createProduct(productData);
        res.redirect('/admin/crud');
    }

    async getAllProductsForView() {
        try {
            const products = await productService.getAllProducts();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.json(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    }
    
    async getProductById(req, res) {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);
        res.json(product);
    }

    async updateProduct(req, res) {
        const { pid } = req.params;
        const updatedData = req.body;
        try {
          await productService.updateProduct(pid, updatedData);
          res.redirect('/admin/crud');
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar el producto' });
        }
    }
    
    async deleteProduct(req, res) {
        const { pid } = req.params;
        try {
          await productService.deleteProduct(pid);
          res.redirect('/admin/crud');
        } catch (error) {
          res.status(500).json({ message: 'Error al eliminar el producto' });
        }
      }
}

export default new ProductController();
