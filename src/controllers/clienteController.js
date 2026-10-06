// Controlador de clientes: lógica de cada operación CRUD
const pool = require('../config/db');

// ---------- Funciones de validación ----------
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const idValido = (id) => /^\d+$/.test(id) && Number(id) > 0;

function validarDatos({ nombre, email, telefono }) {
  const errores = [];

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('El nombre es obligatorio');
  } else if (nombre.trim().length > 100) {
    errores.push('El nombre no puede superar los 100 caracteres');
  }

  if (typeof email !== 'string' || !emailValido(email.trim())) {
    errores.push('El email es obligatorio y debe tener un formato válido');
  } else if (email.trim().length > 150) {
    errores.push('El email no puede superar los 150 caracteres');
  }

  if (telefono !== undefined && telefono !== null) {
    if (typeof telefono !== 'string' || telefono.length > 20) {
      errores.push('El teléfono debe ser texto de máximo 20 caracteres');
    }
  }

  return errores;
}

// ---------- CREATE: POST /api/clientes ----------
const crearCliente = async (req, res) => {
  const datos = req.body || {};
  const errores = validarDatos(datos);
  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }

  const nombre = datos.nombre.trim();
  const email = datos.email.trim().toLowerCase();
  const telefono = datos.telefono || null;

  try {
    // Consulta parametrizada (?) para prevenir inyección SQL
    const [resultado] = await pool.execute(
      'INSERT INTO cliente (nombre, email, telefono) VALUES (?, ?, ?)',
      [nombre, email, telefono]
    );

    const [filas] = await pool.execute(
      'SELECT * FROM cliente WHERE id_cliente = ?',
      [resultado.insertId]
    );

    res.status(201).json({ mensaje: 'Cliente creado correctamente', cliente: filas[0] });
  } catch (error) {
    // Email duplicado (restricción UNIQUE de la base de datos)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un cliente con ese email' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ---------- READ (todos): GET /api/clientes ----------
const obtenerClientes = async (req, res) => {
  try {
    const [filas] = await pool.execute('SELECT * FROM cliente ORDER BY id_cliente');
    res.status(200).json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ---------- READ (uno): GET /api/clientes/:id ----------
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  try {
    const [filas] = await pool.execute(
      'SELECT * FROM cliente WHERE id_cliente = ?',
      [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(filas[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ---------- UPDATE: PUT /api/clientes/:id ----------
const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  const datos = req.body || {};
  const errores = validarDatos(datos);
  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }

  const nombre = datos.nombre.trim();
  const email = datos.email.trim().toLowerCase();
  const telefono = datos.telefono || null;

  try {
    // Primero verificamos que el cliente exista
    const [existe] = await pool.execute(
      'SELECT id_cliente FROM cliente WHERE id_cliente = ?',
      [id]
    );
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await pool.execute(
      'UPDATE cliente SET nombre = ?, email = ?, telefono = ? WHERE id_cliente = ?',
      [nombre, email, telefono, id]
    );

    const [filas] = await pool.execute(
      'SELECT * FROM cliente WHERE id_cliente = ?',
      [id]
    );

    res.status(200).json({ mensaje: 'Cliente actualizado correctamente', cliente: filas[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe otro cliente con ese email' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ---------- DELETE: DELETE /api/clientes/:id ----------
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  try {
    const [resultado] = await pool.execute(
      'DELETE FROM cliente WHERE id_cliente = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente
};