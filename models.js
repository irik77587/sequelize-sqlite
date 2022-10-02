import { createHash } from 'node:crypto';
function hashing(password) {
    return createHash("sha256").update(password,"binary").digest("base64");
}
import {v4 as uuidv4} from "uuid";
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
    footmark: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        set(value) {
            if (value == null) this.setDataValue('footmark', null); else this.setDataValue('footmark', uuidv4());
        }
    }
// }, {
//     instanceMethods: {
//         hashing(password) {
//             return createHash("sha256").update(password,"binary").digest("base64");
//         }
//     }
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