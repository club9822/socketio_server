import {GroupModel} from "./Group";

const {DataTypes } = require('sequelize');

import {sequelize} from "../Config/db";
import {MessageModel} from "./Message";
import {PermissionModel} from "./Permission";
const UserModel = sequelize.define('User', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  last_name:{
    type:DataTypes.STRING
  },
  avatar:{
    type:DataTypes.STRING
  },
  age:{
    type:DataTypes.INTEGER,
    default:0
  },
  status:{
    type:DataTypes.ENUM,
    values: ['active', 'pending', 'deleted']
  },
  created_at:{
    type:DataTypes.DATE,
  },
  updated_at:{
    type:DataTypes.DATE,
  }
}, {
  // Other model options go here
});
UserModel.hasMany(GroupModel);
UserModel.hasMany(MessageModel)
// UserModel.hasMany(PermissionModel);
export {UserModel}
