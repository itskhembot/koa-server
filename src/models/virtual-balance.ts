import sequelize from '../lib/sequelize';

const VirtualBalanceModel = sequelize.define('VirtualBalance', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account: sequelize.Sequelize.INTEGER,
  context: sequelize.Sequelize.STRING,
  balance: sequelize.Sequelize.DOUBLE,
  isCommit: sequelize.Sequelize.BOOLEAN,
}, { tableName: 'VirtualBalance', freezeTableName: true, timestamps: false });

export default VirtualBalanceModel;
