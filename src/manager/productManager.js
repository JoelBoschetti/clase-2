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

  _createFile = async () => {
    try {
      await fs.promises.access(ProductManager.#path);
    } catch (error) {
      await fs.promises.writeFile(ProductManager.#path, "[]");

      console.log(`Archivo creado sactifactoriamente.`);
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

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    try {
      const fileExist = fs.existsSync(ProductManager.#path);

      if (!fileExist) {
        await this._createFile();
      }

      const products = await this.getProducts();

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
          `producto con codigo ${
            product.code
          } ya existe - ${this._getLocaleTime()}`
        );
        return undefined;
      } else {
        products.push(product);
        await this._saveData(products);

        console.log(
          `El producto fue cargado satifactoriamente - ${this._getLocaleTime()}`
        );

        const Reproducts = await this.getProducts();

        console.log(Reproducts);
        return Reproducts;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProducts = async () => {
    try {
      const fileExist = fs.existsSync(ProductManager.#path);

      if (!fileExist) {
        await this._createFile();

        console.log(`[] - ${this._getLocaleTime()}`);
        return undefined;
      }

      const products = await this._readData();

      return products;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = Object.values(products).find((i) => i.id === id);

      if (product === undefined) {
        console.log(`no encontrado - ${this._getLocaleTime()}`);
        return undefined;
      } else {
        console.log(product);
        return product;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  updateProduct = async (id, props) => {
    try {
      const products = await this.getProducts();

      const ix = await products.findIndex((product) => product.id === id);

      if (ix === -1) {
        console.log(`El producto no existe - ${this._getLocaleTime()}`);
        return undefined;
      } else if (props.hasOwnProperty("id") || props.hasOwnProperty("code")) {
        console.log(
          `No se puede actualizar la propiedad 'id' o 'code' - ${this._getLocaleTime()}`
        );
        return false;
      } else {
        Object.assign(products[ix], props);
        const updatedProduct = products[ix];
        await this._saveData(products);

        console.log(updatedProduct);
        return updatedProduct;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();

      const product = Object.values(products).find((i) => i.id === id);

      if (product !== undefined) {
        products = products.filter((i) => i.id !== id);
        const save = await this._saveData(products);

        console.log(`Producto removido - ${this._getLocaleTime()}`);
        return true;
      } else {
        console.log(`El producto no existe - ${this._getLocaleTime()}`);
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };
}

export default ProductManager;
