const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ride = sequelize.define('Ride', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  pickupLocation: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidLocation(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Invalid pickup location format');
        }
        if (!value.latitude || !value.longitude) {
          throw new Error('Pickup location must include latitude and longitude');
        }
      }
    }
  },
  dropoffLocation: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidLocation(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Invalid dropoff location format');
        }
        if (!value.latitude || !value.longitude) {
          throw new Error('Dropoff location must include latitude and longitude');
        }
      }
    }
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['standard', 'premium', 'luxury']]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
    index: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    index: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      fields: ['userId', 'status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Ride; 