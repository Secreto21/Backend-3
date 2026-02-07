import { Router } from 'express';
import Pet from '../models/Pet.js';

const router = Router();

/**
 * GET /api/pets
 * Obtiene todas las mascotas de la base de datos
 */
router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find().populate('owner');
        
        res.status(200).json({
            status: 'success',
            message: `Found ${pets.length} pets`,
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching pets',
            error: error.message
        });
    }
});

/**
 * GET /api/pets/:id
 * Obtiene una mascota específica por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await Pet.findById(id).populate('owner');
        
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Pet not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            payload: pet
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching pet',
            error: error.message
        });
    }
});

/**
 * POST /api/pets
 * Crea una nueva mascota
 */
router.post('/', async (req, res) => {
    try {
        const petData = req.body;
        const pet = new Pet(petData);
        const savedPet = await pet.save();
        
        res.status(201).json({
            status: 'success',
            message: 'Pet created successfully',
            payload: savedPet
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating pet',
            error: error.message
        });
    }
});

/**
 * DELETE /api/pets/:id
 * Elimina una mascota por ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPet = await Pet.findByIdAndDelete(id);
        
        if (!deletedPet) {
            return res.status(404).json({
                status: 'error',
                message: 'Pet not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Pet deleted successfully',
            payload: deletedPet
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting pet',
            error: error.message
        });
    }
});

export default router;