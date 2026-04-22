const Reporte = require('../models/report.model');

const getReportes = async (req, res) => {
    try {
        const { from, to } = req.query;
        const ventas = await Reporte.getVentas(from, to);

        return res.status(200).json({
            message: "Reporte de ventas obtenido exitosamente",
            data: ventas
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al obtener el reporte",
            error: error.message
        });
    }
}

module.exports = { getReportes };