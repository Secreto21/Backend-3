import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../src/models/User.js';
import Pet from '../src/models/Pet.js';
import Adoption from '../src/models/Adoption.js';

describe('Functional tests - adoption.router.js', function () {
    let mongoServer;

    before(async function () {
        this.timeout(30000);
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    after(async function () {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    beforeEach(async function () {
        await Adoption.deleteMany({});
        await Pet.deleteMany({});
        await User.deleteMany({});
    });

    const createUser = async () => User.create({
        first_name: 'Test',
        last_name: 'User',
        email: `test_${Date.now()}_${Math.random()}@mail.com`,
        password: 'coder123',
        role: 'user',
        pets: []
    });

    const createPet = async () => Pet.create({
        name: 'Firulais',
        specie: 'dog',
        adopted: false
    });

    describe('GET /api/adoptions', function () {
        it('debe devolver 200 y un arreglo de adopciones', async function () {
            const response = await request(app).get('/api/adoptions');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
        });
    });

    describe('GET /api/adoptions/:aid', function () {
        it('debe devolver 400 si el id es inválido', async function () {
            const response = await request(app).get('/api/adoptions/invalid-id');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('debe devolver 404 si la adopción no existe', async function () {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const response = await request(app).get(`/api/adoptions/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
        });

        it('debe devolver 200 y la adopción cuando existe', async function () {
            const user = await createUser();
            const pet = await createPet();
            const adoption = await Adoption.create({ owner: user._id, pet: pet._id });

            const response = await request(app).get(`/api/adoptions/${adoption._id}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload._id).to.equal(adoption._id.toString());
        });
    });

    describe('POST /api/adoptions/:uid/:pid', function () {
        it('debe devolver 400 con ids inválidos', async function () {
            const response = await request(app).post('/api/adoptions/invalid/invalid');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('debe devolver 404 si el user o pet no existe', async function () {
            const uid = new mongoose.Types.ObjectId().toString();
            const pid = new mongoose.Types.ObjectId().toString();

            const response = await request(app).post(`/api/adoptions/${uid}/${pid}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
        });

        it('debe crear una adopción y devolver 201', async function () {
            const user = await createUser();
            const pet = await createPet();

            const response = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload.owner).to.equal(user._id.toString());
            expect(response.body.payload.pet).to.equal(pet._id.toString());

            const updatedPet = await Pet.findById(pet._id);
            const updatedUser = await User.findById(user._id);
            expect(updatedPet.adopted).to.equal(true);
            expect(updatedPet.owner.toString()).to.equal(user._id.toString());
            expect(updatedUser.pets.map((p) => p.toString())).to.include(pet._id.toString());
        });

        it('debe devolver 400 si la mascota ya está adoptada', async function () {
            const user = await createUser();
            const pet = await createPet();

            await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
            const secondAttempt = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);

            expect(secondAttempt.status).to.equal(400);
            expect(secondAttempt.body.status).to.equal('error');
        });
    });

    describe('DELETE /api/adoptions/:aid', function () {
        it('debe devolver 400 con id inválido', async function () {
            const response = await request(app).delete('/api/adoptions/invalid-id');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('debe devolver 404 si la adopción no existe', async function () {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const response = await request(app).delete(`/api/adoptions/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
        });

        it('debe eliminar la adopción y devolver 200', async function () {
            const user = await createUser();
            const pet = await createPet();
            const createResponse = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
            const adoptionId = createResponse.body.payload._id;

            const deleteResponse = await request(app).delete(`/api/adoptions/${adoptionId}`);

            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse.body.status).to.equal('success');

            const deletedAdoption = await Adoption.findById(adoptionId);
            const updatedPet = await Pet.findById(pet._id);
            const updatedUser = await User.findById(user._id);

            expect(deletedAdoption).to.equal(null);
            expect(updatedPet.adopted).to.equal(false);
            expect(updatedPet.owner).to.equal(null);
            expect(updatedUser.pets.map((p) => p.toString())).to.not.include(pet._id.toString());
        });
    });
});
