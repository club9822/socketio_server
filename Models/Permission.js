import {UserModel} from "./User";

const {DataTypes } = require('sequelize');

import {sequelize} from "../Config/db";

const PermissionModel = sequelize.define('Permission', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  type: {
    type:DataTypes.ENUM,
    values: ['write', 'pending', 'deleted'],
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
// PermissionModel.belongsTo(UserModel)

export {PermissionModel}
