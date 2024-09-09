import express, { urlencoded } from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';

const app = express ();

//Inicializacion de servidor
app.listen(8080, () => {
    console.log("El servidor esta escuchando")
})

//Analisis de solicitudes
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Implementacion de Router 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);