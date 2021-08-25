module.exports = (sequelize, Sequelize) => {
    const Profesor = sequelize.define("profesors", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        department: {
            type: Sequelize.STRING
        },
        title:{
            type:Sequelize.STRING
        }
    });

    return Profesor;
};