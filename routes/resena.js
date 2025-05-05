const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

router.get('/buscar', resenaController.buscarResenas);

router.get('/', resenaController.getResenas);
router.get('/:id', resenaController.getResenaById);
router.post('/', resenaController.createResena);
router.put('/:id', resenaController.updateResena);
router.delete('/:id', resenaController.deleteResena);

module.exports = router;
