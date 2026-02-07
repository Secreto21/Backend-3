import { Router } from 'express';
import { generateMockPets } from '../utils/mockingPets.js';
import { generateMockUsers, generateUserForDB } from '../utils/mockingUsers.js';
import { generatePetForDB } from '../utils/mockingPets.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

const router = Router();

/**
 * GET /api/mocks/mockingpets
 * Endpoint migrado del primer desafío entregable
 * Genera mascotas mock para testing
 */
router.get('/mockingpets', (req, res) => {
    try {
        // Obtener cantidad de pets del query param, por defecto 100
        const count = parseInt(req.query.count) || 100;
        
        // Generar pets mock
        const mockPets = generateMockPets(count);
        
        res.status(200).json({
            status: 'success',
            message: `Generated ${count} mock pets successfully`,
            payload: mockPets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error generating mock pets',
            error: error.message
        });
    }
});

/**
 * GET /api/mocks/mockingusers
 * Genera 50 usuarios mock con el formato de petición de Mongo
 */
router.get('/mockingusers', async (req, res) => {
    try {
        // Obtener cantidad de users del query param, por defecto 50
        const count = parseInt(req.query.count) || 50;
        
        // Generar users mock con contraseñas encriptadas
        const mockUsers = await generateMockUsers(count);
        
        res.status(200).json({
            status: 'success',
            message: `Generated ${count} mock users successfully`,
            payload: mockUsers
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error generating mock users',
            error: error.message
        });
    }
});

/**
 * POST /api/mocks/generateData
 * Genera e inserta en la base de datos la cantidad de usuarios y mascotas especificadas
 * Body: { users: number, pets: number }
 */
router.post('/generateData', async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;
        
        // Validar que los parámetros sean números válidos
        if (!Number.isInteger(users) || !Number.isInteger(pets) || users < 0 || pets < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Parameters users and pets must be valid positive integers'
            });
        }
        
        const insertedUsers = [];
        const insertedPets = [];
        
        // Generar e insertar usuarios
        if (users > 0) {
            for (let i = 0; i < users; i++) {
                const userData = await generateUserForDB();
                const user = new User(userData);
                const savedUser = await user.save();
                insertedUsers.push(savedUser);
            }
        }
        
        // Generar e insertar mascotas
        if (pets > 0) {
            for (let i = 0; i < pets; i++) {
                const petData = generatePetForDB();
                const pet = new Pet(petData);
                const savedPet = await pet.save();
                insertedPets.push(savedPet);
            }
        }
        
        res.status(201).json({
            status: 'success',
            message: `Successfully generated and inserted ${users} users and ${pets} pets`,
            data: {
                usersInserted: insertedUsers.length,
                petsInserted: insertedPets.length,
                users: insertedUsers,
                pets: insertedPets
            }
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error generating and inserting data',
            error: error.message
        });
    }
});

export default router;