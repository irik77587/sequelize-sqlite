// https://stackoverflow.com/questions/51771380/sequelize-with-sqlite3-doesnt-create-a-database
export default {
    storage: "./database.sqlite",
    username: "root",
    password: "root",
    host: "localhost",
    dialect: "sqlite",
    // logging: console.debug,
    logging: false,
    operatorsAliases: false,
};