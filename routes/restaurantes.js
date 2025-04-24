const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');

router.get('/', restauranteController.getRestaurantes);
router.get('/:id', restauranteController.getRestauranteById);
router.post('/', restauranteController.createRestaurante);
router.put('/:id', restauranteController.updateRestaurante);
router.delete('/:id', restauranteController.deleteRestaurante);

router.get('/cercanos', restauranteController.getRestaurantesCercanos);
router.get('/buscar', restauranteController.buscarRestaurantes);

module.exports = router;