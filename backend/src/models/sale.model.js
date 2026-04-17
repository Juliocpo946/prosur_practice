const db = require('../config/db.config');

class Sale {
    constructor({ id, total }) {
        this.id = id;
        this.total = total;
    }

    async saveWithTransaction(connection) {
        const [result] = await connection.execute("INSERT INTO sales (total) VALUES (?)", [this.total]);

        if (result.insertId === 0) {
            throw new Error("No se insertó la venta");
        }

        return result.insertId;
    }
}

module.exports = Sale;