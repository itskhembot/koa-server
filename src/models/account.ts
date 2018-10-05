import sequelize from '../lib/sequelize';

const AccountModel = sequelize.define('Account', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  balance: sequelize.Sequelize.DOUBLE,
  availableBalance: sequelize.Sequelize.DOUBLE,
}, { tableName: 'Account', freezeTableName: true, timestamps: false });

export default AccountModel;
