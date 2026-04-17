const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const categoryRoutes = require('./src/routes/category.route');
const productRoutes = require('./src/routes/product.route');
const saleRoutes = require('./src/routes/sale.route');

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);


app.listen(PORT, ()=> {
    console.log("API escuchando en el puerto 3000 ");
});