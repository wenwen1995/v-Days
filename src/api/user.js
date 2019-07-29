const Router = require('koa-router');
let router = new Router();
const jwt = require('jsonwebtoken');
const userModel = require('../service/model/user');
const secretHandler = require('../utils/handleSecret');


//用户注册
router.post('/register', async(ctx, next) => {
 const { phoneNumber, password } = ctx.request.body; //获取传来的phoneNumber值

 const pwd = secretHandler.encrypt(password); //密码加密处理

 await userModel.findOne({ phoneNumber },(err,doc) => {
   if(err) {
    ctx.body = { code:500 };
   }else if(doc) { //用户已注册
    ctx.body = { errorMsg:'该用户已注册！' }; 
   }
 });

 const userEntity = new userModel({
  phoneNumber,
  password: pwd
 });

  const user = await userEntity.save();
  ctx.body = { code:200, message:'注册成功！' };
  return next();  
});

//用户登录
router.post('/login',async(ctx,next) => {
 const { phoneNumber, password } = ctx.request.body; //获取传来的phoneNumber值

 const pwd = secretHandler.encrypt(password);

 await userModel.findOne({ phoneNumber },(err,doc) => {
   if(err) {
    ctx.body = { code:500 };
    }else if(doc) { //存在这条数据，比对pwd加密后是否一致
      const { password } = doc;
      const isPwdSame = password === pwd;
      const message = isPwdSame ? '登录成功！' : '密码错误，请重试！';
      if(isPwdSame) {
        //设置token
        const signOptions = { expiresIn:  "120000", }; //过期日期
        const token = jwt.sign({ phoneNumber }, "userToken", signOptions);
        ctx.body = { code:200, message, token: token };

      }else {
        ctx.body = { errorMsg: message };
      }
    }else if(!doc){ //用户不存在
      ctx.body = { errorMsg: '用户不存在！' };
    }
  }).catch(err => {
     ctx.body = { errorMsg:'登录失败！' };
   })

});


//忘记密码
router.post('/forgetPwd',async(ctx,next) => {
 const { phoneNumber, password } = ctx.request.body; //获取传来的phoneNumber值

 const pwd = secretHandler.encrypt(password);

//找到符合条件的phoneNumber,更新对应的密码
 await userModel.findOneAndUpdate( 
      { phoneNumber: phoneNumber }, 
      { $set: { password: pwd } }, 
      (err,doc) => {
        if(err) {
          ctx.body = { code:500 };
        }else if(doc) {
          ctx.body = { code:200, message:'修改成功！' };
        }else {
          ctx.body = { errorMsg:'修改失败！' };
        }
    }).catch(err => {
     ctx.body = { errorMsg:'修改失败！' };
   })
});


//修改密码
router.post('/modifyPwd',async(ctx,next) => {
 const { phoneNumber, initialPwd, newPwd } = ctx.request.body; 

  const initialPwdSecret = secretHandler.encrypt(initialPwd);
  const newPwdSecret = secretHandler.encrypt(newPwd);

  await userModel.findOne({ phoneNumber },(err,doc) => {
    if(err) {
      ctx.body = { code:500 };
    }else if(doc) {
      const { password } = doc;

      //原密码输入的与原来的一致，进行修改密码
      if(password === initialPwdSecret) {

       return userModel.findOneAndUpdate( 
            { phoneNumber: phoneNumber }, 
            { $set: { password: newPwdSecret } }, 
            (err,doc) => {
              if(err) {
                ctx.body = { code:500 };
              }else if(doc) {
                ctx.body = { code:200, message:'修改成功！' };
              }else {
                ctx.body = { errorMsg:'修改失败！' };
              }
          }).catch(err => {
           ctx.body = { errorMsg:'修改失败！' };
         })

     }else {
       ctx.body = { errorMsg:'原密码输入错误！' };
     }

    }else {
      ctx.body = { errorMsg:'出了点问题，修改失败！' };
    }
  });
});



module.exports = router;