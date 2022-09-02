// https://stackoverflow.com/questions/51771380/sequelize-with-sqlite3-doesnt-create-a-database
const config = {
    storage: "./database.sqlite",
    username: "root",
    password: "root",
    host: "localhost",
    dialect: "sqlite",
    // logging: console.debug,
    logging: false,
    operatorsAliases: false,
};

// npm install sequelize sqlite3
import { Sequelize, Model, DataTypes } from "sequelize";

let sequelize = new Sequelize("sqlite::memory:", { logging: false });
//let sequelize = new Sequelize(config.storage, config.username, config.password, config);

// DataTypes.DATEONLY ignores time while DataTypes.DATE doesn't
let User = sequelize.define("User", {
    username: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    password: {
        type: DataTypes.STRING,
        defaultValue: "strongpassword",
    },
});

// Error: SQLITE_ERROR: no such table: Users
// await User.sync();
User.sync().then(async function () {
    User.create({
        username: "janedoe",
        birthday: new Date(1997, 4, 17),
        password: "danejoe",
    });
    User.create({
        username: "davidho",
        birthday: new Date(1997, 5, 1),
    });
    User.create({
        username: "loftyjo",
        birthday: new Date(1997, 4, 21),
        password: "loadash",
    });

    let userList;
    userList = await User.findAll();
    console.log("All users: ", JSON.stringify(userList, null, 2));

    userList = await User.findOne({
        where: {
            password: "strongpassword",
        },
    });
    // console.log(userList.every(user => user instanceof User));
    console.log("Find by username: ", JSON.stringify(userList, null, 2));

    console.log("Updating user details ...");
    User.update(
        {
            password: "heavylo" 
        },
        {
            where: {
                username: userList.username
            } 
        }
    );
    userList = await User.findAll();
    console.log("After update: ", JSON.stringify(userList, null, 2));

    console.log("Deleting a user from database ...");
    User.destroy({
        where: {
            username: "davidho",
        },
    });
    userList = await User.findAll();
    console.log("After deletion: ", JSON.stringify(userList, null, 2));
});
