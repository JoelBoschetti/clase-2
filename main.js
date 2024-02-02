class ProductManager {
    constructor() {
      this.products = [];
      this.id = 1;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      // Validar que todos los campos sean obligatorios
      const required = [title, description, price, thumbnail, code, stock];
      if (!required.every(field => field)) {
        console.log("Se necesitan todos los campos");
        return;
      }
  
      // Validar que no se repita el campo "code"
      if (this.products.some(product => product.code === code)) {
        console.log("Ya existe un producto con el mismo codigo");
        return;
      }
  
      // Agregar el producto con id 
      const newProduct = {
        id: this.id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
  
      this.products.push(newProduct);
      this.id++;
  
      console.log("Producto agregado correctamente:", newProduct);
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
  
      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado");
      }
    }
  }
  

  //Test:

  // Creando el producto
  const productManager = new ProductManager();
  
  productManager.addProduct("Pc", "Pc gamer tope de gama", 500, "imagen1.jpg", "P001", 50);
  productManager.addProduct("Iphone 14 pro", "Iphone de 256gb", 1500, "imagen2.jpg", "P002", 30);

  // Ejemplo de crear el producto con un campo menos
  productManager.addProduct("Tv", "Led de 32 pulgadas", 200, "imagen1.jpg", 50);
  
  //Va tratar de crear el producto con el mismo codigo de un producto ya creado.
  productManager.addProduct("Licuadora", "Licuadora marca Philco", 300, "imagen1.jpg", "P001", 50);

  //Muestra todos los productos
  console.log("Todos los productos:", productManager.getProducts());
  
  //Busca el producto por ID
  const productId = 2;
  const foundProduct = productManager.getProductById(productId);
  console.log(`Producto con ID ${productId}`, foundProduct)