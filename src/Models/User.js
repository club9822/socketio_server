import {GroupModel} from "./Group.js";

import {sequelize} from "../Config/db.js";
import Sequelize from "sequelize";
const {DataTypes} =Sequelize;
const { INTEGER,STRING,ENUM,DATE} =DataTypes
const UserModel = sequelize.define('User', {
  id:{
    type: INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  username: {
    type:  STRING,
    allowNull: false
  },
  // password: {
  //   type: DataTypes.STRING,
  //   set(value) {
  //     // Storing passwords in plaintext in the database is terrible.
  //     // Hashing the value with an appropriate cryptographic hash function is better.
  //     // Using the username as a salt is better.
  //     this.setDataValue('password', hash(this.username + value));
  //   }
  // },
  name: {
    type:  STRING
    // allowNull defaults to true
  },
  last_name:{
    type: STRING
  },
  avatar:{
    type: STRING
  },
  age:{
    type: INTEGER,
    default:0
  },
  status:{
    type: ENUM,
    values: ['active', 'pending', 'deleted']
  },
  created_at:{
    type: DATE,
  },
  updated_at:{
    type: DATE,
  }
}, {
  // Other model options go here
});

export {UserModel}
