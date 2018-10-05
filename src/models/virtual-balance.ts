import sequelize from '../lib/sequelize';

const VirtualBalanceModel = sequelize.define('VirtualBalance', {
  id: {
    type: sequelize.Sequelize.STRING,
    primaryKey: true,
  },
  account: sequelize.Sequelize.STRING,
  context: sequelize.Sequelize.STRING,
  balance: sequelize.Sequelize.DOUBLE,
  isCommit: sequelize.Sequelize.BOOLEAN,
}, { tableName: 'VirtualBalance', freezeTableName: true, timestamps: false });

export default VirtualBalanceModel;
