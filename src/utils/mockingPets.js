import faker from 'faker';

// Configurar faker a español (opcional)
faker.locale = 'es';

// Especies disponibles según el modelo Pet
const SPECIES = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle'];

// Nombres de mascotas comunes por especie
const PET_NAMES = {
    dog: ['Max', 'Buddy', 'Charlie', 'Rocky', 'Cooper', 'Duke', 'Bear', 'Tucker', 'Murphy', 'Jack'],
    cat: ['Luna', 'Bella', 'Oliver', 'Lucy', 'Leo', 'Milo', 'Kitty', 'Jack', 'Lily', 'Charlie'],
    bird: ['Pico', 'Canela', 'Azul', 'Verde', 'Amarillo', 'Rojo', 'Blanco', 'Negro', 'Gris', 'Rosa'],
    fish: ['Nemo', 'Dory', 'Goldie', 'Bubbles', 'Finny', 'Splash', 'Coral', 'Pearl', 'Angel', 'Star'],
    rabbit: ['Bunny', 'Hop', 'Fluffy', 'Cotton', 'Snow', 'Cocoa', 'Pepper', 'Sugar', 'Honey', 'Clover'],
    hamster: ['Peanut', 'Chip', 'Chewy', 'Nibbles', 'Whiskers', 'Fuzzy', 'Tiny', 'Squeaky', 'Marble', 'Oreo'],
    turtle: ['Shelly', 'Slow', 'Sage', 'Crush', 'Franklin', 'Speedy', 'Tank', 'Yertle', 'Toby', 'Leonardo']
};

/**
 * Genera una mascota mock con las especificaciones requeridas
 * @returns {Object} Mascota mock con formato MongoDB
 */
export const generateMockPet = () => {
    // Seleccionar especie aleatoria
    const randomSpecie = SPECIES[Math.floor(Math.random() * SPECIES.length)];
    
    // Seleccionar nombre según la especie
    const specieNames = PET_NAMES[randomSpecie];
    const randomName = specieNames[Math.floor(Math.random() * specieNames.length)];
    
    // Generar fecha de nacimiento aleatoria (entre 1 mes y 5 años atrás)
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 1); // 1 mes atrás
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 5); // 5 años atrás
    
    return {
        _id: faker.database.mongodbObjectId(),
        name: randomName,
        specie: randomSpecie,
        birthDate: faker.date.between(maxDate, minDate),
        adopted: faker.datatype.boolean(),
        owner: faker.datatype.boolean() ? faker.database.mongodbObjectId() : null,
        image: faker.image.animals(), // URL de imagen de animal
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        __v: 0
    };
};

/**
 * Genera múltiples mascotas mock
 * @param {number} count - Cantidad de mascotas a generar
 * @returns {Array} Array de mascotas mock
 */
export const generateMockPets = (count = 100) => {
    const pets = [];
    
    for (let i = 0; i < count; i++) {
        const pet = generateMockPet();
        pets.push(pet);
    }
    
    return pets;
};

/**
 * Genera una mascota para insertar en la base de datos (sin _id)
 * @returns {Object} Mascota para insertar en MongoDB
 */
export const generatePetForDB = () => {
    const randomSpecie = SPECIES[Math.floor(Math.random() * SPECIES.length)];
    const specieNames = PET_NAMES[randomSpecie];
    const randomName = specieNames[Math.floor(Math.random() * specieNames.length)];
    
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 1);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 5);
    
    return {
        name: randomName,
        specie: randomSpecie,
        birthDate: faker.date.between(maxDate, minDate),
        adopted: faker.datatype.boolean(),
        owner: null, // Sin owner al crear
        image: faker.image.animals()
    };
};