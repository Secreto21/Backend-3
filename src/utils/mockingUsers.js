import faker from 'faker';
import bcrypt from 'bcrypt';

// Configurar faker a español (opcional)
faker.locale = 'es';

/**
 * Genera un usuario mock con las especificaciones requeridas
 * @returns {Object} Usuario mock con formato MongoDB
 */
export const generateMockUser = async () => {
    // Encriptar la contraseña "coder123"
    const hashedPassword = await bcrypt.hash('coder123', 10);
    
    // Generar role aleatorio entre 'user' y 'admin'
    const roles = ['user', 'admin'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    return {
        _id: faker.database.mongodbObjectId(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: randomRole,
        pets: [], // Array vacío como se especifica
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        __v: 0
    };
};

/**
 * Genera múltiples usuarios mock
 * @param {number} count - Cantidad de usuarios a generar
 * @returns {Promise<Array>} Array de usuarios mock
 */
export const generateMockUsers = async (count = 50) => {
    const users = [];
    
    for (let i = 0; i < count; i++) {
        const user = await generateMockUser();
        users.push(user);
    }
    
    return users;
};

/**
 * Genera un usuario para insertar en la base de datos (sin _id)
 * @returns {Object} Usuario para insertar en MongoDB
 */
export const generateUserForDB = async () => {
    const hashedPassword = await bcrypt.hash('coder123', 10);
    const roles = ['user', 'admin'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: randomRole,
        pets: []
    };
};