import express, { urlencoded } from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js'
import mongoose from 'mongoose';
import dotenv from "dotenv"; 
import productModel from './models/products.models.js';

const app = express();
dotenv.config();
const uriConexion = process.env.URI_MONGO;

//Inicializacion de servidor
const httpServer = app.listen(8080, () => {
    console.log("El servidor esta escuchando")
})

//Inicializacion Moongose
mongoose.connect(uriConexion)
    .then(() => console.log('Conectado a mongo atlas'))
    .catch((error) => console.log('Error de conexion :', error))

//Analisis de solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Implementacion de Router 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

//Server
const socketServer = new Server(httpServer);

const hbs = handlebars.create({
    helpers: {
        getProp: (obj, prop) => {
            const props = prop.split(".");
            return props.reduce((acc, curr) => acc && acc[curr], obj);
        },
        // multiply: (a, b) => a * b,
        // getTotal: (cart) => {
        //     let total = 0;
        //     cart.forEach((item) => {
        //         const price = item.product.price;
        //         const quantity = item.quantity;
        //         total += price * quantity;
        //     });
        //     return total;
        // },
    },
});

// app.engine('handlebars', handlebars.engine());
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/routes/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));


socketServer.on('connection', (socket) => {
    console.log("Nuevo Cliente Conectado");

    // Obtener productos de la base de datos y emitirlos al cliente
    const fetchProducts = async () => {
        try {
            const products = await productModel.find(); // Asegúrate de importar el modelo de Product
            socket.emit("products", { products });
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    fetchProducts(); // Llamar a la función para obtener los productos al conectarse

    // Manejar la adición de nuevos productos
    socket.on('addProduct', async (newProduct) => {
        try {
            const product = new productModel(newProduct); // Crear una nueva instancia del modelo
            await product.save(); // Guardar en la base de datos
            const products = await productModel.find(); // Obtener la lista actualizada de productos
            socketServer.emit("products", { products }); // Emitir la lista actualizada a todos los clientes
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });
});
