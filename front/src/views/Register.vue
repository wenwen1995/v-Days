<template>
	<div class="wrap">
	  <div>
	  	<box gap="80px 10px">
		  	<group>
		      <x-input  placeholder="请输入手机号" keyboard="number" required v-model="phoneNumber" :max="13" is-type="china-mobile">
		        <img slot="label" style="padding-right:10px;display:block;" src="../assets/phone.png" width="30" height="30">
		      </x-input>
	      </group>
	      <group>
		      <x-input  placeholder="请输入密码" required v-model="password" type="password">
		        <img slot="label" style="padding-right:10px;display:block;" src="../assets/password.png" width="30" height="30">
		      </x-input>
	      </group>
	    </box>
			<box gap="100px 10px">
        <x-button :gradients="['#7aaee5', '#5e83cd']"
				  @click.native="onRegister"
        >注册</x-button>
      </box>
	  </div>
	</div>
</template>
<script >
	import { XInput, Group, XButton, Box, Toast } from 'vux'
	import { URL_REGISTER } from '@/utils/constants';
    import { post } from '@/utils/request';

	export default {
		components: {
			XInput, Group, XButton, Box, Toast
		},
		data() {
			return {
			  phoneNumber: '',
			  password: '',
			}
		},
		methods: {
			validData() {
				const reg = /^1[3456789]\d{9}$/;
				const { phoneNumber, password } = this;
				if(!phoneNumber) {
					this.$vux.toast.text('请输入手机号！', 'middle');
					return false;
				}

				if(!password) {
					this.$vux.toast.text('请输入密码！', 'middle');
					return false;
				}

				if(!reg.test(phoneNumber)) {
					this.$vux.toast.text('号码格式不正确！', 'middle');
					return false;
				}

				if(password.length < 6) {
					this.$vux.toast.text('密码不得小于6位！', 'middle');
					return false;
				}
				return true;
			},
			onRegister() {
				const isValid = this.validData();
				if(isValid) {
					const { phoneNumber, password } = this;
					const data = { phoneNumber, password };
					post(URL_REGISTER,data)
					    .then(res => { //跳转到登录页面
					    	this.$router.push({ path: '/' });
					    	console.log('res ==>',res);
					    }).catch(err => {
					    	console.log('err ==>',err)
					    })
				}
				console.log('isValid ==>',isValid)
			},
			
		}
	}
</script>
<style scoped>
.wrap {
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.logo {
	width: 80px;
	height: 80px;
	box-shadow: 4px 4px 10px #88b1e6;
	border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: skyblue;
  color: #fff;
  margin-top: 80px;
}
.registerText {
	text-align: right;
	color: cadetblue;
  padding-top: 20px;
}
</style>