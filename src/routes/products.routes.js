import { Router } from 'express';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from "uuid";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, "products.json");

//Leer JSON
const readProductsFile = () => {
    if (fs.existsSync(productsFilePath)) {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data);
    }
    return [];
};

//Escribir JSON
const writeProductsFile = (data) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

//Obtener todos los productos
router.get('/', (req, res) => {
    const products = readProductsFile();
    res.json(products);
})

//Obtener productos por Id
router.get('/:pid', (req, res) => {
    products = readProductsFile();
    const {pid} = req.params;
    const product = products.find(product => product.id === Number(pid)); 
    if (!product) {
        return res.status(404).send({status:"error", error: "Producto no encontrado."})
    }
    res.json(product);
})

//Subir nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const products = readProductsFile();

    const newProduct = {
        id: uuidv4(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category
    };

    products.push(newProduct);
    writeProductsFile(products);
    res.status(201).json(newProduct);
})

//Actualizar un producto conservando siempre el mismo Id
router.put('/:pid', (req, res) => {
    const products = readProductsFile();
    const {pid} = req.params;
    const { title, description, code, price, stock, category } = req.body;
    const product = products.find(product => product.id === Number(pid))
    const productIndex = products.findIndex(products => products.id === Number(pid));
    if (!product || productIndex === -1) {
        return res.status(404).send({ status: "error", error: "Producto no encontrado."});
    }
    product.id = product.id
    product.title = title ?? product.title
    product.description = description ?? product.description
    product.code = code ?? product.code
    product.price = price ?? product.price
    product.stock = stock ?? product.stock
    product.category = category ?? product.category

    products[productIndex] = product

    writeProductsFile(products);
    res.json(products[productIndex]);
})

//Eliminar un producto
router.delete('/:pid', (req, res) => {
    const products = readProductsFile();
    const productIdEliminar = req.params.pid;
    const productIndex = products.findIndex(products => products.id === productIdEliminar);
    if (productIndex === -1) {
        return res.status(404).json({error: "Producto no encontrado."})
    }
    products.splice(productIndex, 1);
    writeProductsFile(products);
    res.status(204).json({mensaje: "Producto eliminado."})
})

    export default router;