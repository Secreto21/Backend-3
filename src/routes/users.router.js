import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

/**
 * GET /api/users
 * Obtiene todos los usuarios de la base de datos
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('pets');
        
        res.status(200).json({
            status: 'success',
            message: `Found ${users.length} users`,
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching users',
            error: error.message
        });
    }
});

/**
 * GET /api/users/:id
 * Obtiene un usuario específico por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('pets');
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            payload: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user',
            error: error.message
        });
    }
});

/**
 * POST /api/users
 * Crea un nuevo usuario
 */
router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        const user = new User(userData);
        const savedUser = await user.save();
        
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            payload: savedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating user',
            error: error.message
        });
    }
});

/**
 * DELETE /api/users/:id
 * Elimina un usuario por ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully',
            payload: deletedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting user',
            error: error.message
        });
    }
});

export default router;