import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, setupDBEvents } from './src/utils/database.js';

// Importar routers
import mocksRouter from './src/routes/mocks.router.js';
import usersRouter from './src/routes/users.router.js';
import petsRouter from './src/routes/pets.router.js';

// Configurar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de salud
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Backend III - Entrega N°1 - Mocking y Testing API',
        version: '1.0.0',
        endpoints: {
            mocks: '/api/mocks',
            users: '/api/users',
            pets: '/api/pets'
        },
        availableRoutes: {
            mockingPets: 'GET /api/mocks/mockingpets',
            mockingUsers: 'GET /api/mocks/mockingusers',
            generateData: 'POST /api/mocks/generateData',
            getUsers: 'GET /api/users',
            getPets: 'GET /api/pets'
        }
    });
});

// Configurar rutas
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: {
            home: '/',
            mocks: '/api/mocks',
            users: '/api/users',
            pets: '/api/pets'
        }
    });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    res.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Configurar eventos de base de datos
        setupDBEvents();
        
        // Conectar a la base de datos
        await connectDB();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('🚀 Server started successfully');
            console.log(`📡 Server running on: http://localhost:${PORT}`);
            console.log('📋 Available endpoints:');
            console.log('   • GET  /                           - API Info');
            console.log('   • GET  /api/mocks/mockingpets      - Generate mock pets');
            console.log('   • GET  /api/mocks/mockingusers     - Generate mock users');
            console.log('   • POST /api/mocks/generateData     - Generate and insert data');
            console.log('   • GET  /api/users                  - Get all users');
            console.log('   • GET  /api/pets                   - Get all pets');
            console.log('');
            console.log('✨ Ready to serve requests!');
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Iniciar la aplicación
startServer();

export default app;