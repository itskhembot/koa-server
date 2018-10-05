import sequelize from '../lib/sequelize';

const RequestModel = sequelize.define('Request', {
  id: {
    type: sequelize.Sequelize.STRING,
    primaryKey: true,
    autoIncrement: false,
  },
  result: sequelize.Sequelize.JSON,
  error: sequelize.Sequelize.JSON,
}, { tableName: 'Request', freezeTableName: true, timestamps: false });

export default RequestModel;
