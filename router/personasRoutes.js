// personasRoutes.js
const express = require('express');
const router = express.Router();
const perdat = require('../controllers/PerdatController');

// Rutas relacionadas con personas
router.put('/perdats', perdat.getPerdat);
router.post('/perdats', perdat.createPerdat);
router.post('/perdats/:perdatId', perdat.readPerdat);
router.put('/perdats/:perdatId', perdat.updatePerdat);
router.delete('/perdats/:perdatId', perdat.deletePerdat);

// Exporta el router
module.exports = router;