const express = require('express');
const router = express.Router();
const articuloMenuController = require('../controllers/articuloMenuController');

router.get('/buscar', articuloMenuController.buscarArticulos);

router.route('/')
  .get(articuloMenuController.getArticulos)
  .post(articuloMenuController.createArticulo);

router.route('/:id')
  .get(articuloMenuController.getArticuloById)
  .put(articuloMenuController.updateArticulo)
  .delete(articuloMenuController.deleteArticulo);

router.get('/restaurante/:restauranteId', articuloMenuController.getMenuRestaurante);

router.patch('/:id/disponibilidad', articuloMenuController.cambiarDisponibilidad);
router.patch('/:id/especial', articuloMenuController.toggleEspecialDelDia);
router.patch('/:id/popularidad', articuloMenuController.actualizarPopularidad);

router.get('/ingrediente/:ingrediente', articuloMenuController.getArticulosPorIngrediente);
router.get('/dieta/:dieta', articuloMenuController.getArticulosPorDieta);

router.post('/bulk', articuloMenuController.bulkUpdateArticulos);
router.post('/bulk/create', articuloMenuController.crearMultiplesArticulos);
router.delete('/bulk/delete', articuloMenuController.eliminarMultiplesArticulos);


module.exports = router;