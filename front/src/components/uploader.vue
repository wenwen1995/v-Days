<template>
  <div>
    <div v-show="showHeader" class="weui-uploader__hd">
      <p class="weui-uploader__title"> {{ title }} </p>
      <div v-show="showHeader && showTip" class="weui-uploader__info">
        {{ images.length }} / {{ max }}
      </div>
    </div>
   
  <div class="file-wrap">
    <!-- 显示上传的小图 -->
    <ul class="weui-uploader__files">
      <li v-for="image in images" class="imgWrap" :key="image" >
        <img :src="image" class="imgStyle" @click="preview(image)">
        <x-icon type="ios-close" size="30" class="deleteIcon" @click="remove"></x-icon>
      </li>
    </ul>
  
      <!-- 预览大图 -->
      <div class="uploaderPreviewImg" v-if="showPreview" @click="hidePreview">
        <ul class="weui-uploader__files">
        <li v-for="image in images" :key="image" >
          <img :src="image" class="bigImgStyle" >
        </li>
      </ul>
      </div>

      <!-- 上传图片 -->
      <div v-show="!readOnly && images.length < max" class="weui-uploader__input-box">
        <input  ref="input" class="weui-uploader__input" type="file" accept="image/*" :capture="showCapture" @change="change">
      </div>
    </div>

    <!-- 删除确认的弹框 -->
    <div v-transfer-dom>
      <confirm v-model="showDialog"
      title="提示"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      >
        <p style="text-align:center;">确认删除此图吗？</p>
      </confirm>
    </div>

  </div>
</template>

<script >
  import { Confirm } from 'vux'
  export default {
    props: {
      images: {
        type: Array,
        default: () => []
      },
      max: {
        type: Number,
        default: 1
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      showTip: {
        type: Boolean,
        default: true
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '图片上传'
      },
      capture: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: 'img'
      },
    },
    components: {
      Confirm,
    },
    data() {
      return {
        showPreview: false, //预览大图与否
        showDialog: false, //显示删除图片的dialog
      }
    },
    methods: {
      onCancel() {
        this.showDialog = false;
      },
      onConfirm() {
         // 移除图片的时候将input file 置空，否则删除该图片之后无法再次上传该图片
        document.querySelector('.weui-uploader__input').value = '';
        this.$emit('removeImg')
      },
      change() {
        const fileInfo = this.$refs.input.files[0];

        console.log('file is ==>',fileInfo)

        const { type, size } = fileInfo;
        const reg = /(gif|png|jpe?g)/;

        if(!reg.test(type)) { //非图片
          this.$vux.toast.text('上传文件类型不对！', 'middle');
          return false;
        }

        //图片尺寸大于30M，不允许上传
        if((size/(1024*1024)) > 30) {
          this.$vux.toast.text('文件尺寸过大，请重新选择！', 'middle');
          return false;
        }

        const self = this;

        const reader = new FileReader();

        //图片转成base 64 格式
        reader.readAsDataURL(fileInfo);

        //读取成功后，进行回调
        reader.onloadend = function() {
          let result = this.result;
          const img = new Image();
          img.src = result;
          // console.log('result is ==>',result);


          img.onload = function() {
             // base64 转化成blob 
            let data = self.compressImg(img); //压缩图片
            let blob = self.dataURItoBlob(data);
            console.log('now blob is -->',blob)

            // blob 转化为 form表单
            let formData = new window.FormData();
            formData.append(self.name,blob); //上传文件的信息放在对应的键值对中

            self.$emit('uploadImg',formData);
          }
        }

      },
      dataURItoBlob(dataURI) {
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
        const byteString = atob(dataURI.split(',')[1]); //base64 解码
        const arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
        const intArray = new Uint8Array(arrayBuffer); //创建视图

        for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([intArray], {type: mimeString});
      },
      compressImg(img) {
         let canvas = document.createElement('canvas');
         let ctx = canvas.getContext('2d');
         const initSize = img.src.length;
         let width = img.width;
         let height = img.height;
         canvas.width = width;
         canvas.height = height;
         //铺底色
         ctx.fillStyle = '#fff';
         ctx.fillRect(0,0,canvas.width,canvas.height);
         ctx.drawImage(img,0,0,width,height);

         //进行最小压缩
         let pressData = canvas.toDataURL('image/jpeg',0.1);
         console.log('压缩前==>',initSize);
         console.log('压缩后==>',pressData.length);
         console.log('压缩率===>'+ ~~(100 * (initSize - pressData.length) / initSize) + "%");
         return pressData;
      },
      remove() {
        this.showDialog = true;
      },
      preview(img) {
        this.showPreview = true;
      },
      hidePreview() {
        this.showPreview = false;
      }

    },
    computed: {
      showCapture() { //调取相机
        return this.capture || undefined;
      },
    }
  }
</script>

<style scoped lang="less">
@import '~vux/src/styles/weui/widget/weui-uploader/index.less';

.weui-uploader__title {
  color: #999999;
}

.weui-uploader__hd {
  padding: 10px;
}

.weui-uploader__bd.small {
  .weui-uploader__input-box {
    margin-right: 5px;
    margin-bottom: 5px;
    width: 58px;
    height: 58px;
  }
  .weui-uploader__file {
    width: 60px;
    height: 60px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}

.imgWrap {
  position: relative;
}

.deleteIcon {
  position: absolute;
  right: -8px;
  top: -10px;
  display: block;
  fill: red;
 }

.imgWrap, .imgStyle{
  width: 77px;
  height: 77px;
  border-radius: 8px;
  border: 1px dashed lightgray;
  margin-bottom: 10px;
}

.file-wrap {
  padding: 10px 0 0 10px;
}

.uploaderPreviewImg {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.9);
  z-index: 100;
}

.bigImgStyle {
  width: 400px;
  height: auto;
}

</style>