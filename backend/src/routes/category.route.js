const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.index);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.delete('/:id', categoryController.delete);
router.patch('/:id', categoryController.update);

module.exports = router;