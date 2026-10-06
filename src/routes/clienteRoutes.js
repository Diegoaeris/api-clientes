// Rutas de clientes: asocia cada URL con su función del controlador
const express = require('express');
const router = express.Router();
const {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clienteController');

router.post('/', crearCliente);
router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;