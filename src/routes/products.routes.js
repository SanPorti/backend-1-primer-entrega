import { Router } from 'express';
import productModel from '../models/products.models.js';

const router = Router();

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page);
    if (!page || page <= 0) page = 1;

    try {
        const $and = [];

        if (req.query?.title) $and.push({ title:  req.query.title });
        if (req.query?.price) $and.push({ price:  req.query.price });
        const filters = $and.length > 0 ? { $and } : {};

        const sort = {
            asc: { price: 1 },
            desc: { price: -1 },
        };
        const result = await productModel.paginate(filters, { page, limit: req.query?.limit ?? 10, sort: sort[req.query?.sort] ?? {}, lean: true });
        const products = {
            
            status: "succes",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : null,

        }
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ status: "error", error: 'Error al obtener productos.' });
    }
});

// router.get('/', async (req, res) => {
//     let page = parseInt(req.query.page);
//     if (!page || page <= 0) page = 1;

//     // Filtrado por título
//     const query = req.query.query ? { title: new RegExp(req.query.query, 'i') } : {};
    
//     // Ordenamiento
//     const sort = req.query.sort === 'asc' ? { price: 1 } : req.query.sort === 'desc' ? { price: -1 } : {};

//     try {
//         const result = await productModel.paginate(query, {
//             page,
//             limit: 10,
//             sort,
//             lean: true
//         });

//         const products = {
//             status: "success",
//             payload: result.docs,
//             totalPages: result.totalPages,
//             prevPage: result.prevPage,
//             nextPage: result.nextPage,
//             page: result.page,
//             hasPrevPage: result.hasPrevPage,
//             hasNextPage: result.hasNextPage,
//             prevLink: result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : null,
//             nextLink: result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : null,
//         };
        
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ status: "error", error: 'Error al obtener productos.' });
//     }
// });


router.get('/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const newProduct = new productModel({
            title,
            description,
            code,
            price,
            stock,
            category,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto.' });
    }
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(pid, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado.' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await productModel.findByIdAndDelete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.status(204).json({ mensaje: 'Producto eliminado.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});

    export default router;