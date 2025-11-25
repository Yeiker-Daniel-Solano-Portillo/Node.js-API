const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint principal de búsqueda
app.get('/api/search', async (req, res) => {
    try {
        const { game } = req.query;
        
        if (!game) {
            return res.status(400).json({ 
                error: 'El parámetro "game" es requerido' 
            });
        }

        // Conectar con CheapShark API
        const response = await axios.get('https://www.cheapshark.com/api/1.0/games', {
            params: {
                title: game,
                limit: 10,  // Límite de resultados
                exact: 0    // Búsqueda no exacta
            }
        });

        // Procesar y formatear los datos
        const games = response.data.map(game => ({
            id: game.gameID,
            nombre: game.external,
            precioMasBajo: game.cheapest ? `$${game.cheapest}` : 'No disponible',
            precioRetail: game.cheapest ? `$${(parseFloat(game.cheapest) + 5).toFixed(2)}` : 'No disponible',
            tienda: 'Varias tiendas',
            imagen: game.thumb,
            enlace: `https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID}`
        }));

        res.json({
            success: true,
            query: game,
            cantidadResultados: games.length,
            resultados: games
        });

    } catch (error) {
        console.error('Error al buscar juegos:', error.message);
        res.status(500).json({ 
            error: 'Error interno del servidor al buscar juegos',
            detalle: error.message 
        });
    }
});

// Endpoint adicional para obtener detalles específicos de un juego
app.get('/api/game/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.get(`https://www.cheapshark.com/api/1.0/games?id=${id}`);
        
        res.json({
            success: true,
            detalles: response.data
        });

    } catch (error) {
        console.error('Error al obtener detalles:', error.message);
        res.status(500).json({ 
            error: 'Error al obtener detalles del juego',
            detalle: error.message 
        });
    }
});

// Endpoint de salud para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'GameScout Backend funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint no encontrado',
        disponibles: [
            'GET /api/search?game=nombre_juego',
            'GET /api/game/:id',
            'GET /api/health'
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🎮 GameScout Backend corriendo en puerto ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Ejemplo búsqueda: http://localhost:${PORT}/api/search?game=call of duty`);
});