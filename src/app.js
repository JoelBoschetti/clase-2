import express from "express";
import ProductManager from "./manager/productManager.js";

const app = express();
const productManager = new ProductManager();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message:
      "Bienvenido, to access the products go to the route localhost:8080/products",
  });
});

app.post("/products", async (req, res) => {
  const { title, description, price, code, stock } = req.body;
  const thumbnail = req.body.thumbnail ? req.body.thumbnail : [];

  if (!title || !description || !code || !price || !stock) {
    res.json("Todos los requisitos son necesarios");
  }

  try {
    const createProduct = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );

    if (createProduct !== undefined) {
      res.status(201).json("El producto fue creado satisfactoriamente");
    } else {
      res.status(400).json("El producto ya existe");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/products", async (req, res) => {
  const { limit } = req.query;

  try {
    const products = await productManager.getProducts();

    if (products === undefined) {
      res.status(200).json([]);
    }

    if (!limit || limit < 1) {
      res.status(200).json(products);
    } else {
      const limitedProducts = products.slice(0, limit);
      res.status(206).json(limitedProducts);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productManager.getProductById(Number(pid));

    if (product === undefined) {
      res.status(404).json("No encontrado");
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const props = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(
      Number(pid),
      props
    );

    if (updatedProduct === undefined) {
      res.status(404).json(`Producto con id: ${pid} no encontrado.`);
    } else if (updatedProduct === false) {
      res.status(404).json("No se pudo actualizar la propiedad 'id' o 'code'");
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete("/products/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productManager.deleteProduct(Number(pid));

    if (product === undefined) {
      res.status(404).json("No encontrado");
    } else {
      res.status(200).json(`Producto con id: ${pid} fue removido`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor andando en puerto: ${PORT}`);
});
