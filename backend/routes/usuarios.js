const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/cercanos', usuarioController.getUsuariosCercanos);
router.get('/buscar', usuarioController.buscarUsuarios);

router.route('/')
  .get(usuarioController.getUsuarios)
  .post(usuarioController.createUsuario);
router.route('/:id')
  .get(usuarioController.getUsuarioById)
  .put(usuarioController.updateUsuario)
  .delete(usuarioController.deleteUsuario);
router.post('/:id/direcciones', usuarioController.agregarDireccion);
router.route('/:usuarioId/direcciones/:direccionId')
  .put(usuarioController.actualizarDireccion)
  .delete(usuarioController.eliminarDireccion);
router.post('/:id/metodos-pago', usuarioController.agregarMetodoPago);
router.delete('/:usuarioId/metodos-pago/:metodoPagoId', usuarioController.eliminarMetodoPago);
router.post('/:id/favoritos', usuarioController.agregarRestauranteFavorito);
router.delete('/:usuarioId/favoritos/:restauranteId', usuarioController.eliminarRestauranteFavorito);
router.post('/bulk', usuarioController.crearMultiplesUsuarios);
router.delete('/bulk', usuarioController.eliminarMultiplesUsuarios);

module.exports = router;