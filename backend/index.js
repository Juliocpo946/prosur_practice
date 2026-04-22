require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors({
    origin: '*'
}));
app.use(express.json());


const categoryRoutes = require('./src/routes/category.route');
const productRoutes = require('./src/routes/product.route');
const saleRoutes = require('./src/routes/sale.route');
const reportRoutes = require('./src/routes/report.route');

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);



app.listen(PORT, ()=> {
    console.log(`API escuchando en el puerto ${PORT}`);
});