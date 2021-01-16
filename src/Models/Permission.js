import {UserModel} from "./User.js";

import {sequelize} from "../Config/db.js";
import Sequelize from "sequelize";
const {DataTypes} =Sequelize
const { INTEGER,STRING,ENUM,DATE} =DataTypes
const PermissionModel = sequelize.define('Permission', {
  id:{
    type: INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  type: {
    type: ENUM,
    values: ['write', 'pending', 'deleted'],
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
// PermissionModel.belongsTo(UserModel)

export {PermissionModel}
