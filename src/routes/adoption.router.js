import { Router } from 'express';
import mongoose from 'mongoose';
import Adoption from '../models/Adoption.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const adoptions = await Adoption.find().populate('owner').populate('pet');
        res.status(200).json({
            status: 'success',
            payload: adoptions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching adoptions',
            error: error.message
        });
    }
});

router.get('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(aid)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid adoption id'
            });
        }

        const adoption = await Adoption.findById(aid).populate('owner').populate('pet');

        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adoption not found'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: adoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching adoption',
            error: error.message
        });
    }
});

router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(uid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user or pet id'
            });
        }

        const user = await User.findById(uid);
        const pet = await Pet.findById(pid);

        if (!user || !pet) {
            return res.status(404).json({
                status: 'error',
                message: 'User or Pet not found'
            });
        }

        if (pet.adopted) {
            return res.status(400).json({
                status: 'error',
                message: 'Pet is already adopted'
            });
        }

        const adoption = await Adoption.create({
            owner: user._id,
            pet: pet._id
        });

        pet.adopted = true;
        pet.owner = user._id;
        await pet.save();

        user.pets.push(pet._id);
        await user.save();

        res.status(201).json({
            status: 'success',
            message: 'Pet adopted successfully',
            payload: adoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating adoption',
            error: error.message
        });
    }
});

router.delete('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(aid)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid adoption id'
            });
        }

        const adoption = await Adoption.findById(aid);
        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adoption not found'
            });
        }

        const pet = await Pet.findById(adoption.pet);
        const user = await User.findById(adoption.owner);

        if (pet) {
            pet.adopted = false;
            pet.owner = null;
            await pet.save();
        }

        if (user) {
            user.pets = user.pets.filter((petId) => petId.toString() !== adoption.pet.toString());
            await user.save();
        }

        await Adoption.findByIdAndDelete(aid);

        res.status(200).json({
            status: 'success',
            message: 'Adoption deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting adoption',
            error: error.message
        });
    }
});

export default router;
