import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specie: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle']
    },
    birthDate: {
        type: Date,
        default: Date.now
    },
    adopted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;