
import express from 'express';
import cartModel from '../models/carts.models.js'; // Importa tu modelo de carrito
import productModel from '../models/products.models.js'; // Importa tu modelo de producto

const router = express.Router();

// ELIMINAR producto seleccionado del carrito

                                                    // FUNCIONA

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product.toString() !== pid);
        await cart.save();

        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});

// ACTUALIZAR carrito con un arreglo de productos

                                                    // FUNCIONA

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; 

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.products = products.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        await cart.save();
        res.json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el carrito', error });
    }
});

// ACTUALIZAR solo cantidad de ejemplares del producto

                                                    // FUNCIONA

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const productInCart = cart.products.find(item => item.product.toString() === pid);
        if (!productInCart) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

        productInCart.quantity = quantity;

        await cart.save();

        res.json({ message: 'Cantidad del producto actualizada', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error });
    }
});

// ELIMINAR todos los productos del carrito

                                                    // FUNCIONA

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();

        res.json({ message: 'Todos los productos eliminados del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar productos del carrito', error });
    }
});

// OBTENER carrito

                                                    // FUNCIONA

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartModel.findById(cid).populate('products.product');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
});

// CREAR Carrito 

                                                    // FUNCIONA

router.post("/", async (req, res) => {

    try {
        const cart = new cartModel({ products: [] });
        await cart.save();
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }

});

// AGREGAR producto al carrito


                                                    // FUNCIONA

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const cartFound = await cartModel.findById(cid);
    
        const productFound = await productModel.findById(pid);
    

        if(!cartFound){
            throw new Error("No se encuentra el carrito");
        }
        if(!productFound){
            throw new Error("No se encuentra el producto");
        }

        const productInCart = cartFound.products.find( (product) =>  product.product._id.toString() === pid.toString());

        if(productInCart){
            productInCart.quantity++;
        } else {

            cartFound.products.push({ product: pid, quantity: 1 });
        }
        
        await cartFound.save();

        res.status(201).json({ status: "success", payload: cartFound });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }

});

export default router;



