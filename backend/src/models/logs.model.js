module.exports = (sequelize, Sequelize) => {
    const Logs = sequelize.define("activity_logs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: Sequelize.STRING
        },
        activityLog: {
            type: Sequelize.STRING
        },
        userId:{
            type:Sequelize.INTEGER
        }
    });

    return Logs;
};