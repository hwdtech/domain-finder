module.exports = function (sequelize, DataTypes) {
  const RussianDomain = sequelize.define('RussianDomain', {
      sldLength: DataTypes.INTEGER,
      tld: DataTypes.STRING,
      domain: DataTypes.STRING,
      available: DataTypes.STRING,
      description: DataTypes.TEXT,
      freeDate: DataTypes.STRING
    },
    {
      timestamps: false
    });
  return RussianDomain;
};
