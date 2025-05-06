const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');

router.get('/', ordenController.getOrdenes);
router.get('/:id', ordenController.getOrdenById);
router.post('/', ordenController.createOrden);
router.put('/:id', ordenController.updateOrden);
router.delete('/:id', ordenController.deleteOrden);

module.exports = router;
