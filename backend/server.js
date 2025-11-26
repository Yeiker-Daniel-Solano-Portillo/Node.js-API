const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint principal de búsqueda
app.get('/api/search', async (req, res) => {
    try {
        const { game } = req.query;
        
        if (!game) {
            return res.status(400).json({ error: 'El parámetro "game" es requerido' });
        }

        // Conexión con CheapShark API
        const response = await axios.get(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(game)}`);
        
        // Formatear datos para el frontend
        const formattedGames = response.data.map(game => ({
            external: game.external,
            cheapest: game.cheapest,
            cheapestDealID: game.cheapestDealID,
            thumb: game.thumb
        }));

        res.json(formattedGames); // Ahora devolvemos el array directamente
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'Servidor funcionando correctamente' });
});

// Ruta para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Frontend disponible en: http://localhost:${PORT}`);
});