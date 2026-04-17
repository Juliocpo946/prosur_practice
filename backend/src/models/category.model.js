const db = require('../config/db.config');

class Category {
    constructor({ id, name, active }) {
        this.id = id;
        this.name = name;
        this.active = active;
    }

    static async getAll() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT * FROM categories WHERE active = 1");
        connection.end();
        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id]);
        connection.end();

        if (rows.length > 0) {
            return new Category(rows[0]);
        }
        return null;
    }

    async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute("INSERT INTO categories (name) VALUES (?)", [this.name]);
        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó la categoría");
        }

        this.id = result.insertId;
        this.active = 1;
        return this.id;
    }

    static async updateById(id, { name }) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó la categoría");
        }
        return;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("UPDATE categories SET active = 0 WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó la categoría");
        }
        return;
    }
}

module.exports = Category;