import express, { urlencoded } from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js'
import fs, { read } from "fs";
import path from 'path';
import { v4 as uuidv4 } from "uuid";

const app = express();

//Inicializacion de servidor
const httpServer = app.listen(8080, () => {
    console.log("El servidor esta escuchando")
})

const productsFilePath = path.join(__dirname, "/data/products.json");
console.log(__dirname);
console.log(productsFilePath);

const readProductsFile = () => {
    if (fs.existsSync(productsFilePath)) {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data);
    }
    return [];
};

//Analisis de solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Implementacion de Router 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Server
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/routes/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);

socketServer.on('connection', (socket) => {
    console.log("Nuevo Cliente Conectado");

    const products = readProductsFile();
    socket.emit("products", { products });

    // Manejar la adición de nuevos productos
    socket.on('addProduct', (newProduct) => {
        const products = readProductsFile();
        newProduct.id = uuidv4(); // Generar un nuevo ID único
        products.push(newProduct); // Agregar el nuevo producto al array

        fs.writeFileSync(productsFilePath, JSON.stringify(products)); // Guardar productos en el archivo
        socketServer.emit("products", { products }); // Emitir la lista actualizada a todos los clientes
    });
});


