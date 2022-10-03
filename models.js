import { createHash } from 'node:crypto';
function hashing(password) {
    return createHash("sha256").update(password,"binary").digest("base64");
}
import { Sequelize, Model, DataTypes } from "sequelize";
let sequelize = new Sequelize("sqlite::memory:", { logging: false });

// Alternatively import cofigurations to create a persistent file-based database
// import dbconf from './dbconf';
// let sequelize = new Sequelize(dbconf.storage, dbconf.username, dbconf.password, dbconf);

// https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export
export let Users = sequelize.define("Users", {
    useruuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', hashing(this.useruuid + value));
        }
    },
});

export let Notes = sequelize.define("Notes", {
    hash: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

Users.hasMany(Notes, {
    foreignKey: {
        name: "user",
        allowNull: false,
        type: DataTypes.UUID
    }
});
Notes.belongsTo(Users, {
    foreignKey: "user"
});

Users.sync();
Notes.sync();