import {sequelize} from "../Config/db";
import {UserModel} from "../Models/User";
import {GroupModel} from "../Models/Group";
import {MessageModel} from "../Models/Message";

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log("sync:::");
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
  await sequelize
    .authenticate()
    .then((r) => {
      res.send(r)
    })
    .catch(err => {
      res.send(err)
    })


});
router.get('/user', async function(req, res, next) {
  try{
    const users = await UserModel.findAll()
    res.send(users)
  }catch (e){
    res.send(e)
  }

})

router.post('/user/create', async function(req, res, next) {
  try{
    const {username,name='',lastname='',age=0,status='active',avatar=null}=req.body
    const user = await UserModel.create({
      username : username,
      name: name,
      lastname: lastname,
      age: age,
      status: status,
      avatar: avatar,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.send(user)
  }catch (e){
    res.send(e)
  }

})

router.get('/group', async function(req, res, next) {
  try{
    const groups = await GroupModel.findAll()
    res.send(groups)
  }catch (e){
    res.send(e)
  }

})

router.post('/group/create', async function(req, res, next) {
  try{
    const {name,status='active',description='',userId} =req.body
    const group = await GroupModel.create({
      name:name,
      created_at: new Date(),
      updated_at: new Date(),
      UserId: userId
    });
    res.send(group)
  }catch (e){
    res.send(e)
  }

})

router.get('/message', async function(req, res, next) {
  try{
    const messages = await MessageModel.findAll()
    res.send(messages)
  }catch (e){
    res.send(e)
  }

})
router.post('/message/create', async function(req, res, next) {
  try{
    const {text,type='text',groupId,status='active'}=req.body
    const {id}=req.user
    const message = await MessageModel.create({
      status:status,
      text:text,
      type:type,
      created_at: new Date(),
      updated_at: new Date(),
      UserId:userId,
      GroupId:groupId
    });
    res.send(message)
  }catch (e){
    res.send(e)
  }

})

router.get('/user_groups', async function(req, res, next) {
  try{
    const groups = await MessageModel.findAll({where: {UserId: req.query?.userId}})
    res.send(groups)
  }catch (e){
    res.send(e)
  }

})

module.exports = router;
