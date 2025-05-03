const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const restauranteRoutes = require('./routes/restaurantes');

dotenv.config();

connectDB();

const app = express();


app.use(express.json());

app.use('/api/restaurantes', restauranteRoutes);

app.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});