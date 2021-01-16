import {UserModel} from "./User.js";
import {sequelize} from "../Config/db.js";
import Sequelize from "sequelize";
const { INTEGER,STRING,ENUM,DATE,TEXT} =Sequelize.DataTypes
const GroupModel = sequelize.define('Group', {
  id:{
    type: INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  name: {
    type: STRING,
    allowNull: false
  },
  description: {
    type:  TEXT,
  },
  logo:{
    type: STRING,
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


export {GroupModel}
