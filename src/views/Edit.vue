<template>
  <div >
	  <group title="标题">
	    <x-input  v-model="title" placeholder="请输入标题"></x-input>
	  </group>
	  <group title="描述">
       <x-textarea v-model="description" placeholder="请输入描述" :autosize="true"></x-textarea>
	  </group>
    <group>
      <Uploader :images="images" 
                :max="1"
                :readOnly="false"
                name="file"
                @uploadImg="uploadImg"
                @removeImg="removeImg"

      />
    </group>
     <group>
        <calendar :readonly="readonly" v-model="calendarDate" title="日期"  placeholder="请选择日期" ></calendar>
      </group>
      <box gap="60px 10px">
        <x-button :gradients="['#7aaee5', '#5e83cd']"
				  @click.native="onSubmit"
        >确定</x-button>
      </box>
   </div>
</template>

<script>
import { Toast, Calendar, Group, XInput, XButton, Box, dateFormat, XTextarea  } from 'vux';
import Uploader from '../components/uploader';
import { URL_MODIFY_RECORD, URL_UPLOAD_IMG, URL_DELETE_IMG, BASE_URL } from '@/utils/constants';
import { post } from '@/utils/request';


export default {
  name: 'Add',
  components: {
    Toast, Calendar, Group, XInput,
    XButton, Box, XTextarea, Uploader,
  },
  data () {
    return {
      id: '',
      title:'',
      description:'',
      //一下为日期选择
      calendarDate: '',
      readonly: false,
      images: [], //上传文件
      uploadFileName: '',
    }
  },
  mounted() {
  	const { query } = this.$route;
  	if(Object.keys(query).length) {
	  	const { setTimeStamp, fileName } = query;

      if(fileName) {
        let url = `${BASE_URL}/${fileName}`;
        this.images.push(url);
        this.uploadFileName = fileName;
      }
      
	  	this.calendarDate = dateFormat(setTimeStamp, 'YYYY-MM-DD');
	  	Object.assign(this, {...this.$route.query});
	  	console.log('mounted this',this)
  	}
  },
  methods: {
    isDataValid() {
      const { title, calendarDate } = this;
      if(!title) {
        this.$vux.toast.text('请输入标题！', 'middle');
        return false;
      }

      if(!calendarDate) {
        this.$vux.toast.text('请选择一个日期', 'middle');
        return false;
      }
      return true;
    },
    onSubmit() {
      const isValid = this.isDataValid();
      if(!isValid) {
        return;
      }

      const phoneNumber = localStorage.getItem('phoneNumber');
      const { title, description, id, uploadFileName } = this;
      const setTimeStamp = Date.parse(new Date(this.calendarDate));
      const data = { title, description, setTimeStamp, phoneNumber, fileName: uploadFileName };
      if(id) { data.id = id; }


      post(URL_MODIFY_RECORD,{...data})
          .then((res) => {
            console.log('add ==>',res)
            this.$router.push('/record');
          })
    },
    uploadImg(data) {
      this.$vux.loading.show('正在上传...');
      post(URL_UPLOAD_IMG,data)
          .then((res) => {
            let { name } = res.data;
            let url = `${BASE_URL}/${name}`;
            this.uploadFileName = name;
            this.$vux.loading.hide();
            this.images.push(url);
            console.log('upload res ==?',res,url)
          }).catch(err => {
            this.$vux.loading.hide();
            console.log('err ==>',err)
          })
    },
    removeImg() {
      const { uploadFileName,id } = this;
      const data = { fileName: this.uploadFileName };
      if(id) { data.id = id; }

      post(URL_DELETE_IMG,{...data})
          .then(res => {
            this.images.pop();
          })
    }
    
  },
}
</script>


<style scoped>

</style>
