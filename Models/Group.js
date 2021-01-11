import {UserModel} from "./User";

const {DataTypes } = require('sequelize');

import {sequelize} from "../Config/db";
import {PermissionModel} from "./Permission";
import {MessageModel} from "./Message";

const GroupModel = sequelize.define('Group', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
  },
  logo:{
    type:DataTypes.STRING,
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
// GroupModel.belongsToMany(UserModel,{through:"UserGroup"});
GroupModel.hasMany(MessageModel)
// GroupModel.hasMany(PermissionModel);

export {GroupModel}
