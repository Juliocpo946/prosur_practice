const db = require('../config/db.config');

class Reporte {
    static async getVentas(from, to) {
        const connection = await db.createConnection();
        
        let query = `
            SELECT s.id AS sale_id, s.total, 
                   si.product_id, si.quantity, si.unit_price,
                   p.name AS product_name
            FROM sales s
            JOIN sale_items si ON s.id = si.sale_id
            JOIN products p ON si.product_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (from) {
            query += " AND DATE(s.created_at) >= ?";
            params.push(from);
        }
        if (to) {
            query += " AND DATE(s.created_at) <= ?";
            params.push(to);
        }

        const [rows] = await connection.execute(query, params);
        connection.end();

        const salesMap = {};
        for (let row of rows) {
            if (!salesMap[row.sale_id]) {
                salesMap[row.sale_id] = {
                    id: row.sale_id,
                    total: row.total,
                    items: []
                };
            }
            salesMap[row.sale_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                unit_price: row.unit_price
            });
        }

        return Object.values(salesMap);
    }
}

module.exports = Reporte;