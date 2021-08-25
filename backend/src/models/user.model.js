module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: Sequelize.STRING
        },
        full_name: {
            type: Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        password: {
            type: Sequelize.STRING
        },
        last_login_date: {
            type: Sequelize.DATE
        },
    });

    return User;
};