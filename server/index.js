// server.js
import express from "express";
import mercadopago from "mercadopago";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 8080
app.use(express.json());
app.use(cors())


mercadopago.configure({
  access_token: "TEST-5675349213703236-060517-c87ada6ae4f03415cd7636a2b3c3d4b4-275029655",
});

app.post("/create_preference", (req, res) => {

    const cart = req.body.products; 
    console.log(cart);
   
    let items = cart.map((product) => {
      return {
        title: product.name, // Nombre del producto
        unit_price: Number(product.price), // Precio unitario del producto
        quantity: product.cantidad, // Cantidad del producto
      };
    });
  let preference = {
    items:items,
    
    back_urls: {
      success: "http://localhost:5173/success", 
      failure: "http://localhost:5173/failure", 
      pending: "http://localhost:5173/pending", 
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
        status:"success"
      });
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({
        message: "Error al crear la preferencia",
      });
    });
});

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
