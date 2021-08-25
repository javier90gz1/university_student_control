module.exports = (sequelize, Sequelize) => {
    const City = sequelize.define("cities", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
    });

    return City;
};