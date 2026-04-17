const db = require('../config/db.config');

class SaleItem {
    constructor({ id, sale_id, product_id, quantity, unit_price }) {
        this.id = id;
        this.sale_id = sale_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.unit_price = unit_price;
    }

    async saveWithTransaction(connection) {
        const [result] = await connection.execute(
            "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
            [this.sale_id, this.product_id, this.quantity, this.unit_price]
        );

        if (result.insertId === 0) {
            throw new Error("No se insertó el detalle de la venta");
        }

        return result.insertId;
    }
}

module.exports = SaleItem;