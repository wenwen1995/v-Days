const Router = require('koa-router');
let router = new Router();
const recordModel = require('../service/model/record');

//获取记录list 进行分页
router.get('/list',async(ctx, next) => {
  let { page, pageSize, phoneNumber, searchValue } = ctx.request.query;
  page = Number(page - 1);
  pageSize = Number(pageSize);

  //搜索条件不区分大小写
  const reg = new RegExp(searchValue,'i');

  //以手机号作为标识进行唯一查找
  const allCount = recordModel.find(
  {
   phoneNumber,
   $or: [ //多条件，数组
    { title: { $regex: reg } },
    { description: { $regex: reg } },
   ] 
  }
  );

  //获得结果按照id降序排，即时间最新的在最前面，最早的在后面
  const result = recordModel.find(
             {
               phoneNumber,
               $or: [ //多条件，数组
                { title: { $regex: reg } },
                { description: { $regex: reg } },
               ] 
              }
             )
             .skip(page * pageSize)
             .limit(pageSize)
             .sort({ '_id': -1 })
             .exec();


  return Promise.all([allCount,result])
                .then(res => {
                  //结果res得到的是个数组，all中传递了几个，res就有几个值
                  const total = res[0].length ? res[0].length : 0;
                  const list = res[1].length ? res[1] : [];
                  ctx.body = {
                    total,
                    code: 200,
                    list,
                  };
                }).catch(err => {
                  ctx.body = { code:500 };
                });
});

//添加记录 or 修改记录
router.post('/modifyRecord',async(ctx,next) => {
  const { id, } = ctx.request.body;
  const newObj = Object.assign({},ctx.request.body);
  if(id) { //为修改
      //找出符合条件的id,进行对应内容的修改
      await recordModel.findOneAndUpdate(
       { _id: id },
       { $set: newObj },
       (err,doc) => {
         if(err) {
          ctx.body = { code:500 };
          }else if(doc) {
            ctx.body = { code:200, message:'修改成功！' };
          }else {
            ctx.body = { errorMsg:'修改失败！' };
          }
       })
  }else { //新增
    const recordEntity = new recordModel(newObj);
    await recordEntity.save();
    ctx.body = { code:200, message:'新增成功！' };
    return next();  
  }
});

//删除记录
router.post('/deleteRecord',async(ctx,next) => {
  const { id } = ctx.request.body;
  await recordModel.findByIdAndRemove({"_id": id},(err,doc) => {
    if(err) {
      ctx.body = { code:500 };
    }else if(doc){
      ctx.body = { code:200, message:'删除成功' };
    }
  })
})

module.exports = router;


