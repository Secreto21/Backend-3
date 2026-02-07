import mongoose from 'mongoose';

/**
 * Conecta a la base de datos MongoDB
 */
export const connectDB = async () => {
    try {
        // URL de conexión por defecto para desarrollo local
        const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend3_entrega1';
        
        const connection = await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${connection.connection.name}`);
        console.log(`🌐 Host: ${connection.connection.host}:${connection.connection.port}`);
        
        return connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

/**
 * Desconecta de la base de datos MongoDB
 */
export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB disconnected successfully');
    } catch (error) {
        console.error('❌ MongoDB disconnection error:', error.message);
    }
};

/**
 * Maneja los eventos de conexión de MongoDB
 */
export const setupDBEvents = () => {
    mongoose.connection.on('connected', () => {
        console.log('🔗 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('🔌 Mongoose disconnected from MongoDB');
    });
    
    // Cerrar la conexión cuando se termina la aplicación
    process.on('SIGINT', async () => {
        await disconnectDB();
        process.exit(0);
    });
};