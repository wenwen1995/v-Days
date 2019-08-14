const multer = require('koa-multer'); //上传文件的中间件

let storage = multer.diskStorage({
  destination: function(req,file,cb) { //配置图片上传的目录
    cb(null,'./static/');
  },
  filename: function(req,file,cb) { //上传后完成重命名
    const fileFormat = file.originalname.split('.'); 
    const fileFormatLen = fileFormat.length;
    const finalName = `${fileFormat[0]}-${Date.now()}.${fileFormat[fileFormatLen-1]}`;
    cb(null, finalName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('This is not image file type'), false)
  }
};

let upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;

