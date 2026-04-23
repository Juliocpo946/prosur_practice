const db = require('../config/db.config');
const Sale = require('../models/sale.model');
const SaleItem = require('../models/saleItem.model');
const Product = require('../models/product.model');

const create = async (req, res) => {
    const connection = await db.createConnection();

    try {
        await connection.beginTransaction();

        const sale = new Sale({ total: req.body.total });
        const saleId = await sale.saveWithTransaction(connection);

        for (let item of req.body.items) {
            const saleItem = new SaleItem({
                sale_id: saleId,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            });
            await saleItem.saveWithTransaction(connection);
            await Product.updateStockWithTransaction(connection, item.product_id, item.quantity);
        }

        await connection.commit();
        connection.end();

        return res.status(200).json({
            message: "venta creada exitosamente",
            saleId: saleId
        });

    } catch (error) {
        await connection.rollback();
        connection.end();

        return res.status(500).json({
            message: "ocurrió un error al crear la venta",
            error: error.message
        });
    }
}

module.exports = { create };