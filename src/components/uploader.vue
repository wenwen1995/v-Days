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


  </div>
</template>

<script >
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
      // // 是否接管+号的click事件，如果是，点击不弹出选择文件的框
      // handleClick: {
      //   type: Boolean,
      //   default: false
      // },
      size: {
        type: String,
        default: 'normal'
      },
      capture: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: 'img'
      },
      params: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        showPreview: false, //预览大图与否
      }
    },
    methods: {
      change() {
        let formData = new window.FormData();
        const fileInfo = this.$refs.input.files[0];
        formData.append(this.name,fileInfo); //上传文件的信息放在对应的键值对中

        const fileType = fileInfo.type;
        const reg = /(gif|png|jpe?g)/;

        if(!reg.test(fileType)) { //非图片
          this.$vux.toast.text('上传文件类型不对！', 'middle');
          return false;
        }

        console.log('file is ==>',fileInfo)

        if(this.params) {
          for(let key in this.params) {
            formData.append(key,this.params[key]);
          }
        }

        this.$emit('uploadImg',formData);

      },
      remove() {
         // 移除图片的时候将input file 置空，否则删除该图片之后无法再次上传该图片
        document.querySelector('.weui-uploader__input').value = '';
        this.$emit('removeImg')
      },
      preview(img) {
        console.log('img is -->',img)
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
  height: 300px;
}

</style>