module.exports = function (sequelize, DataTypes) {
    const FreeDomain = sequelize.define('FreeDomain', {
            sldLength: DataTypes.INTEGER,
            tld: DataTypes.STRING,
            domain: DataTypes.STRING,
            price: DataTypes.STRING,
            roublePrice: DataTypes.STRING,
            available: DataTypes.STRING,
            definitive: DataTypes.STRING
        },
        {
            timestamps: false
        });
    return FreeDomain;
};
