// Improved error handling and database connection validation

import { createConnection } from 'typeorm';
import { DatabaseConnectionError } from './errors';

async function connectToDatabase() {
    try {
        const connection = await createConnection();
        console.log('Database connected successfully!');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw new DatabaseConnectionError('Could not connect to the database');
    }
}

export { connectToDatabase };