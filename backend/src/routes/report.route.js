const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/report.controller');

router.get('/', reporteController.getReportes);

module.exports = router;