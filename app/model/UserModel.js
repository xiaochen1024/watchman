const { ROLE_CUSTOMER } = require('../enum/Role');

module.exports = app => {
  const { INTEGER, STRING, DATE, UUID, UUIDV4 } = app.Sequelize;

  const UserModel = app.model.define('fw_user', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: STRING(50),
      allowNull: false,
    },
    email: {
      type: STRING(50),
      allowNull: true,
    },
    phone: {
      type: STRING(20),
      allowNull: true,
    },
    role: {
      type: INTEGER(4),
      allowNull: false,
      defaultValue: ROLE_CUSTOMER,
    },
    enabled: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    createTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updateTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  }, {
    timestamps: false,
  });

  UserModel.beforeBulkUpdate(({ attributes }) => {
    attributes.updateTime = new Date();
  });

  return UserModel;
};
