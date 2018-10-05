import sequelize from '../lib/sequelize';

const ReservedBalanceModel = sequelize.define('ReservedBalance', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account: sequelize.Sequelize.INTEGER,
  context: sequelize.Sequelize.STRING,
  balance: sequelize.Sequelize.DOUBLE,
  isReleased: sequelize.Sequelize.BOOLEAN,
}, { tableName: 'ReservedBalance', freezeTableName: true, timestamps: false });

export default ReservedBalanceModel;
