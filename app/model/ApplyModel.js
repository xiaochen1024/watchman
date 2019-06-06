module.exports = app => {
  const { INTEGER, STRING, DATE, UUID, UUIDV4  } = app.Sequelize;

  const Apply = app.model.define('fw_apply', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: STRING,
      allowNull: false,
    },
    status: {
      type: INTEGER,
      allowNull: false,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    appKey: {
      type: UUID,
      defaultValue: UUIDV4,
    },
    url: {
      type: STRING,
      allowNull: false,
    },
    blacklist: STRING,
    description: STRING,
    mail: STRING,
    createTime: DATE,
    passTime: DATE,
  });

  Apply.findByUserName = function(userName, pageNum, pageSize) {
    return Apply.findAndCount({
      where: { userName },
      offset: pageSize * (pageNum - 1),
      limit: pageSize,
    });
  };

  return Apply;
};