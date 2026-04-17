const Product = require('../models/product.model');

const index = async (req, res) => {
    try {
        const products = await Product.getAll();
        return res.status(200).json({
            message: "productos obtenidos exitosamente",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al obtener los productos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idProduct = req.params.id;
        const product = await Product.getById(idProduct);

        if (!product) {
            return res.status(404).json({
                message: `no se encontró el producto con id ${idProduct}`
            });
        }

        return res.status(200).json({
            message: "producto encontrado exitosamente",
            product
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al obtener el producto",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const product = new Product({
            category_id: req.body.category_id,
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock
        });

        await product.save();

        return res.status(200).json({
            message: "producto creado exitosamente",
            product
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al crear el producto",
            error: error.message
        });
    }
}

const update = async (req, res) => {
    try {
        const idProduct = req.params.id;
        const dataToUpdate = {
            category_id: req.body.category_id,
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock
        }

        await Product.updateById(idProduct, dataToUpdate);

        return res.status(200).json({
            message: "el producto se actualizó correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrrio un error al actualizar el producto",
            error: error.message
        });
    }
}

const deleteLogico = async (req, res) => {
    try {
        const idProduct = req.params.id;
        await Product.deleteLogicoById(idProduct);

        return res.status(200).json({
            message: "se eliminó el producto correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al eliminar el producto",
            error: error.message
        });
    }
}

module.exports = {
    index,
    getById,
    create,
    update,
    delete: deleteLogico
}