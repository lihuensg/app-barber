import app from './app.js';
import { sequelize } from './database/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    try {
        await sequelize.sync({ force: false});  
        app.listen(process.env.PORT || 4000);
        console.log('Server is running on port', process.env.PORT || 4000);   
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();