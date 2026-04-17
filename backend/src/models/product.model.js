const db = require('../config/db.config');

class Product {
    constructor({ id, category_id, name, price, stock, active }) {
        this.id = id;
        this.category_id = category_id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.active = active;
    }

    static async getAll() {
        const connection = await db.createConnection();
        const [rows] = await connection.query(`
            SELECT p.*, c.name as category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.active = 1 AND c.active = 1
        `);
        connection.end();
        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute(`
            SELECT p.*, c.name as category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [id]);
        connection.end();

        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }

    async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute(
            "INSERT INTO products (category_id, name, price, stock) VALUES (?, ?, ?, ?)",
            [this.category_id, this.name, this.price, this.stock]
        );
        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el producto");
        }

        this.id = result.insertId;
        this.active = 1;
        return this.id;
    }

    static async updateById(id, { category_id, name, price, stock }) {
        const connection = await db.createConnection();
        const [result] = await connection.execute(
            "UPDATE products SET category_id = ?, name = ?, price = ?, stock = ? WHERE id = ?",
            [category_id, name, price, stock, id]
        );
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el producto");
        }
        return;
    }

    static async updateStockWithTransaction(connection, id, quantity) {
        const [result] = await connection.execute(
            "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
            [quantity, id, quantity]
        );

        if (result.affectedRows === 0) {
            throw new Error("No hay suficiente stock");
        }
        return;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("UPDATE products SET active = 0 WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el producto");
        }
        return;
    }
}

module.exports = Product;