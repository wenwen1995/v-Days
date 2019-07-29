<template>
  <div >
	  <group title="标题：">
	    <x-input  v-model="title" placeholder="请输入标题"></x-input>
	  </group>
	  <group title="描述：">
       <x-textarea v-model="description" placeholder="请输入描述" :autosize="true"></x-textarea>
	  </group>
     <group>
        <calendar :readonly="readonly" v-model="calendarDate" title="日期"  placeholder="请选择日期" ></calendar>
      </group>
      <box gap="100px 10px">
        <x-button :gradients="['#1D62F0', '#19D5FD']"
				  @click.native="onSubmit"
        >确定</x-button>
      </box>
   </div>
</template>

<script>
import { Toast, Calendar, Group, XInput, XButton, Box, dateFormat, XTextarea  } from 'vux';
import { URL_MODIFY_RECORD } from '@/utils/constants';
import { post } from '@/utils/request';


export default {
  name: 'Add',
  components: {
    Toast, Calendar, Group, XInput, XButton, Box, XTextarea,
  },
  data () {
    return {
      id: '',
      title:'',
      description:'',
      //一下为日期选择
      calendarDate: '',
      readonly: false,
    }
  },
  mounted() {
  	const { query } = this.$route;
  	if(Object.keys(query).length) {
	  	const { setTimeStamp } = query;
	  	this.calendarDate = dateFormat(setTimeStamp, 'YYYY-MM-DD');
	  	Object.assign(this, {...this.$route.query});
	  	console.log('mounted this -->',this)
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
      const { title, description, id } = this;
      const setTimeStamp = Date.parse(new Date(this.calendarDate));
      const data = { title, description, setTimeStamp, phoneNumber };
      if(id) { data.id = id; }

      post(URL_MODIFY_RECORD,{...data})
          .then((res) => {
            console.log('add ==>',res)
            this.$router.push('/record');
          })
    },
  },
}
</script>


<style scoped>
.vux-label {
	color: red;
}
</style>
