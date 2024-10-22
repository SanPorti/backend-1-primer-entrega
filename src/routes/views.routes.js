import express, { response } from 'express';
import __dirname from '../utils.js';
import productModel from '../models/products.models.js';
import cartModel from '../models/carts.models.js';

const router = express.Router();

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page);
    if (!page || page <= 0) page = 1;

    try {
        const result = await productModel.paginate({}, { page, limit: 10, lean: true });
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages);

        res.render('home', 
            { products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            page: page,
            prevLink: result.prevLink,
            nextLink: result.nextLink,
            isValid: result.isValid,
            totalPages: result.totalPages,}
        );
    } catch (error) {
        console.error('Error al paginar productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {});
});

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid).populate('products.product');
    
    res.render('cart', {cart: cart.products});
})

export default router;