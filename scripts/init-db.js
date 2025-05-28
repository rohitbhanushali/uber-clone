const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false
});

async function initializeDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Unable to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 