module.exports = (sequelize, Sequelize) => {
  return sequelize.define("user", {
    name: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    number: {
      type: Sequelize.STRING(30),
      allowNull: false
    }
  });
};
