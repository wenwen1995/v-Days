<template>
	<div class="wrap">
	  <div class="logo">v-Days</div>
	  <div>
	  	<box gap="60px 10px">
		  	<group>
		      <x-input  placeholder="请输入手机号" keyboard="number" required v-model="phoneNumber" :max="13" is-type="china-mobile">
		        <img slot="label" style="padding-right:10px;display:block;" src="../assets/phone.png" width="30" height="30">
		      </x-input>
	      </group>
	      <group>
		      <x-input  placeholder="请输入密码" required v-model="password" :type="showType" :min="6">
		        <img slot="label" style="padding-right:10px;display:block;" src="../assets/password.png" width="30" height="30" >
		        <span slot="right" @click="switchShowPwd">
		        	<x-icon type="ios-eye" size="30"></x-icon>
		        </span>
		      </x-input>
	      </group>
	      <flexbox>
		      <flexbox-item><div class="forgetPwd" @click="goForgetPwd">忘记密码？</div></flexbox-item>
		      <flexbox-item><div class="registerText" @click="goRegister">立即注册</div></flexbox-item>
		    </flexbox>
	    </box>
			<box gap="40px 10px">
        <x-button :gradients="['#7aaee5', '#5e83cd']"
				  @click.native="onLogin"
        >登录</x-button>
      </box>
	  </div>
	</div>
</template>
<script >
	import { XInput, Group, XButton, Box, Toast, Flexbox, FlexboxItem, } from 'vux';
	import { URL_LOGIN } from '@/utils/constants';
	import { post } from '@/utils/request';

	export default {
		components: {
			XInput, Group, XButton, Box, Toast, Flexbox, FlexboxItem,
		},
		data() {
			return {
			  phoneNumber: '',
			  password: '',
			  showType: 'password', //密码形式
			}
		},
		methods: {
			switchShowPwd() { //显示密码
				this.showType = this.showType === 'password' ? 'text' : 'password';
			},
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
			onLogin() {
				const isValid = this.validData();
				if(isValid) {
					const { phoneNumber, password } = this;
					const data = { phoneNumber, password };
					post(URL_LOGIN,data)
					    .then(res => {
					    	const { token } = res.data;
					      this.setDataToStorage({ token, phoneNumber });
					      
								this.$router.push({
										path: '/record',
								});
								
					    }).catch(err => {
					    	console.log('err ==>',err)
					    })
				}
				
			},
			setDataToStorage(data) {
				const { phoneNumber, token } = data;
				const skinColor =  localStorage.getItem('skinColor')
				                 ? localStorage.getItem('skinColor')
				                 : '#4990ee';
				localStorage.setItem('phoneNumber',phoneNumber);
				localStorage.setItem('token',token);
				localStorage.setItem('token_exp',new Date().getTime());
				localStorage.setItem('skinColor',skinColor)
			},
			goRegister() {
				this.$router.push({
					path: '/register'
				});
			},
			goForgetPwd() {
				this.$router.push({
					path: '/forgetPwd'
				});
			}
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
	color: darkgrey;
  padding-top: 20px;
}
.forgetPwd {
	text-align: left;
	color: #576FA0;
  padding-top: 20px;
}
</style>