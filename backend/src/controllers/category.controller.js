const Category = require('../models/category.model');

const index = async (req, res) => {
    try {
        const categories = await Category.getAll();
        return res.status(200).json({
            message: "categorías obtenidas exitosamente",
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al obtener las categorías",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idCategory = req.params.id;
        const category = await Category.getById(idCategory);

        if (!category) {
            return res.status(404).json({
                message: `no se encontrp la categoría con id ${idCategory}`
            });
        }

        return res.status(200).json({
            message: "categoría encontrada exitosamente",
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al obtener la categoría",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name
        });

        await category.save();

        return res.status(200).json({
            message: "categoría creada exitosamente",
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al crear la categoría",
            error: error.message
        });
    }
}

const update = async (req, res) => {
    try {
        const idCategory = req.params.id;
        const dataToUpdate = {
            name: req.body.name
        }

        await Category.updateById(idCategory, dataToUpdate);

        return res.status(200).json({
            message: "la categoría se actualizó correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocrurrio un error al actualizar la categoría",
            error: error.message
        });
    }
}

const deleteLogico = async (req, res) => {
    try {
        const idCategory = req.params.id;
        await Category.deleteLogicoById(idCategory);

        return res.status(200).json({
            message: "se elimino la categoría correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrio un error al eliminar la categoría",
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