import fs from "fs";

class ProductManager {
  static #path = "./mock/products.json";
  constructor() {
    this.products = [];
    ProductManager.#path;
  }

  _getNextId = () => {
    const data = fs.readFileSync(ProductManager.#path);
    const products = JSON.parse(data);

    const count = products.length;
    const nextId = count > 0 ? products[count - 1].id + 1 : 1;

    return nextId;
  };

  _getLocaleTime = () => {
    const time = new Date().toLocaleTimeString();
    return time;
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const products = await this.getProducts();

    try {
      const product = {
        id: this._getNextId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      if (products.find((product) => product.code === code)) {
        console.log(
          `producto de codigo: ${
            product.code
          } ya existe - ${this._getLocaleTime()}`
        );
      } else {
        products.push(product);
        await this._saveData(products);

        console.log(
          `el producto se cargo correctamente - ${this._getLocaleTime()}`
        );
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProducts = async () => {
    try {
      if (fs.existsSync(ProductManager.#path)) {
        const products = await this._readData()

        return products;
      } else {
        console.log(`[] - ${this._getLocaleTime()}`);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProductById = async (id) => {
    const products = await this.getProducts();

    try {
      const product = Object.values(products).find((i) => i.id === id);

      if (product === undefined) {
        console.log(`no se encontro - ${this._getLocaleTime()}`);
      } else {
        console.log(product);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  updateProduct = async (id, props) => {
    const products = await this.getProducts();
    try {
      const ix = await products.findIndex((product) => product.id === id);

      if (ix === -1) {
        console.log("el producto no existe");
      } else if (props.hasOwnProperty("id") || props.hasOwnProperty("code")) {
        console.log("no se puede actualizar el 'id' o el 'code'");
      } else {
        Object.assign(products[ix], props);
        const updatedProduct = products[ix];
        await this._saveData(products);

        console.log(updatedProduct);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  deleteProduct = async (id) => {
    let products = await this.getProducts();

    try {
      const product = Object.values(products).find((i) => i.id === id);

      if (product !== undefined) {
        products = products.filter((i) => i.id !== id);
        await this._saveData(products);

        console.log(`producto removido - ${this._getLocaleTime()}`);
      } else {
        console.log(`producto no existe - ${this._getLocaleTime()}`);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  _saveData = async (data) => {
    try {
      await fs.promises.writeFile(
        ProductManager.#path,
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.log(err);
    }
  };

  _readData = async () => {
    try {
      const data = await fs.promises.readFile(ProductManager.#path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      console.log(err);
    }
  };
}

const productManager = new ProductManager();

/* const consulta = async () => {
  console.log("----------Consulta de productos----------");
  const queryProducts = await productManager.getProducts();
  console.log(queryProducts);
};
consulta(); */

/* const carga = async () => {
  console.log("----------Carga de producto----------");
  const product1 = await productManager.addProduct(
    "Producto prueba2",
    "Este es un producto prueba2",
    200,
    "Sin imagen2",
    "abc123",
    1
  );
};
carga(); */

/* const consultaPorId = async () => {
  console.log("----------Consulta de producto por id----------");
  const idProduct = await productManager.getProductById(11);
};
consultaPorId(); */

/* const actualizar = async () => {
  console.log("----------Actualizacion de producto----------");
  const productUpdate1 = await productManager.updateProduct(11, { title: "producto prueba modificado", description: "Lorem Ipsum modificado", stock: 50 });
};
actualizar(); */

/* const borrar = async () => {
  console.log("----------Borra producto por id----------");
  const idDelete = await productManager.deleteProduct(11);
};
borrar(); */
