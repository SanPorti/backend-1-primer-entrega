import express, { response } from 'express';
import fs, { read } from "fs";
import __dirname from '../utils.js';
import path from 'path';

const router = express.Router();
const productsFilePath = path.join(__dirname, "/data/products.json");

const readProductsFile = () => {
    if (fs.existsSync(productsFilePath)) {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data);
    }
    return [];
};

router.get('/', (req, res) => {
    const products = readProductsFile()
    res.render('home', {products}); 
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {}); 
});

export default router;