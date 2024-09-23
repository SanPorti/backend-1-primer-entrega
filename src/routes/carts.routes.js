import { Router } from 'express';
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const carritoFilePath = path.join(__dirname, "../data/carrito.json");

const readCartFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return [];
};

const writeCartFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
    const carts = readCartFile(carritoFilePath);
    res.json(carts);
})

router.get('/:cid', (req, res) => {
    const carts = readCartFile(carritoFilePath);
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
        return res.status(404).send({ status: "error", error: "Carrito no encontrado." })
    }
    res.json(cart.products);
})

router.post('/', (req, res) => {
    const carts = readCartFile(carritoFilePath);
    const newCart = {
        id: uuidv4(),
        products: []
    };

    carts.push(newCart);
    writeCartFile(carritoFilePath, carts);
    res.status(201).json(newCart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
        return res.status(404).send({ status: "error", error: "Carrito no encontrado." });
    }

    const carts = readCartFile(carritoFilePath);
    const productIndex = cart.products.findIndex(prod => prod.product === productId);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({
            product: productId,
            quantity: 1
        });
    }

    writeCartFile(carritoFilePath, carts);
    res.json(cart);
});

export default router;