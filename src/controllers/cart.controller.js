import cartService from "../service/cart.service.js";
import ticketModel from "../models/ticket.model.js";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
})


class CartController {
  async createCart(req, res) {
    try {
      const { user, products } = req.body;
  
      if (!user) return res.status(400).json({ error: "Se requiere el ID del usuario" });
  
      const newCart = await cartService.createCart(user, products);
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el carrito' });
    }
  }
  

  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      await cartService.addProductToCart(cid, pid);
      res.redirect("/auth/current");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
  }
  

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartService.deleteProductFromCart(cid, pid);
      if (!updatedCart) return res.status(404).json({ error: "Carrito no encontrado" });
  
      res.redirect("/auth/current");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
  }
  

  async deleteAllProductsFromCart(req, res) {
    try {
      const { cid } = req.params;
      const updatedCart = await cartService.deleteAllProductsFromCart(cid);
      if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
      res.json({ success: 'Todos los productos eliminados del carrito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
  }

  async purchaseCart(req, res) {
    try {
      const { cid } = req.params;

      const cart = await cartService.getCartById(cid);
      if (!cart || cart.products.length === 0) {
        return res.status(404).json({ error: "Carrito no encontrado o vacío" });
      }

      const userEmail = cart?.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: "No se encontró el email del usuario" });
      }


      const total = cart.products.reduce(
        (acc, item) => acc + item.producto.precio * item.cantidad,
        0
      );

      const ticket = await ticketModel.create({
        purchaser: userEmail,
        amount: total,
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Ticket de Compra",
        html: `
          <h1>¡Gracias por tu compra!</h1>
          <p>Total: $${total}</p>
          <p>Ticket ID: ${ticket._id}</p>
          <ul>
            ${cart.products
              .map(
                item =>
                  `<li>${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio}</li>`
              )
              .join("")}
          </ul>
        `,
      };

      await transporter.sendMail(mailOptions);
      await cartService.deleteAllProductsFromCart(cid);

      res.status(200).json({
        message: "Compra realizada y ticket enviado al email.",
        ticket,
      });

    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ error: "Error al procesar la compra" });
    }
  }

}

export default new CartController();

