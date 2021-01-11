import {sequelize} from "../Config/db";
import {UserModel} from "../Models/User";
import {JWT} from "../Config/jwt";

var express = require('express');
var router = express.Router();

router.get('/',function (req,res,next){
  res.render('auth/login/index', { title: 'Login' });
})

/* GET home page. */
router.post('/', async function(req, res, next) {
  console.log(req.body)
    try{
      const body = req.body;
      const {username,password}= body
      const user= await UserModel.findOne({where:{username:username}})
        if(user){
          const {id,username}=user
          const token= JWT.generateToken(res,id,username)
          res.send({
            ... user?.dataValues,token:token
          })
        }else {
          throw Error('no user found')
        }
    }catch (e){
      res.send(e)
    }
});

module.exports = router;
