module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define("students", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        age: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        sex: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        born_date: {
            type: Sequelize.DATE
        },
        cityId:{
            type:Sequelize.INTEGER
        },
        groupId:{
            type:Sequelize.INTEGER
        }
    });

    return Student;
};