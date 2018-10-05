import sequelize from '../lib/sequelize';

const ReservedBalanceModel = sequelize.define('ReservedBalance', {
  id: {
    type: sequelize.Sequelize.STRING,
    primaryKey: true,
  },
  account: sequelize.Sequelize.STRING,
  context: sequelize.Sequelize.STRING,
  balance: sequelize.Sequelize.DOUBLE,
  isReleased: sequelize.Sequelize.BOOLEAN,
}, { tableName: 'ReservedBalance', freezeTableName: true, timestamps: false });

export default ReservedBalanceModel;
