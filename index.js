const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const restauranteRoutes = require('./routes/restaurantes');
const usuarioRoutes = require('./routes/usuarios'); 
const resenaRoutes = require('./routes/resena'); 
const articuloMenuRoutes = require('./routes/articulosMenu');
const ordenRoutes = require('./routes/orden');



dotenv.config();

connectDB();

const app = express();


app.use(express.json());

app.use('/api/restaurantes', restauranteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/articulos-menu', articuloMenuRoutes);
app.use('/api/ordenes', ordenRoutes);



app.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});