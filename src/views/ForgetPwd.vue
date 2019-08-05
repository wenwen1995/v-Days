<template>
	<div>
		<box gap="100px 10px">
			<group>
    	 <x-input  placeholder="请输入手机号" keyboard="number" required v-model="phoneNumber" :max="13" is-type="china-mobile">
	        <img slot="label" style="padding-right:10px;display:block;" src="../assets/phone.png" width="30" height="30">
	      </x-input>
		  </group>
		  <group>
	      <x-input  placeholder="请输入新密码" required v-model="newPwd" type="password" :min="6">
	        <img slot="label" style="padding-right:10px;display:block;" src="../assets/password.png" width="30" height="30">
	      </x-input>
		  </group>
		</box>
	  <box gap="100px 10px">
        <x-button :gradients="['#7aaee5', '#5e83cd']"
				  @click.native="onResetPwd"
        >确定</x-button>
    </box>
	</div>
</template>
<script >
  import { XInput, Group, XButton, Box, Toast } from 'vux';
  import { URL_FORGET_PWD } from '@/utils/constants';
	import { post } from '@/utils/request';
  
	export default {
		components: {
			XInput, Group, XButton, Box, Toast
		},
		data(){
			return {
				phoneNumber: '',
				newPwd:'',
			}
		},
		methods:{
			validData() {
				const { phoneNumber, newPwd } = this;
				if(!phoneNumber) {
					this.$vux.toast.text('请输入手机号！', 'middle');
					return false;
				}
				if(!newPwd) {
					this.$vux.toast.text('请输入新密码！', 'middle');
					return false;
				}

				if(newPwd.length < 6) {
					this.$vux.toast.text('新密码不得小于6位！', 'middle');
					return false;
				}
				return true;
			},
			onResetPwd() {
				const isValid = this.validData();
				if(isValid) {
					const { phoneNumber, newPwd } = this;
					const data = { phoneNumber, password: newPwd };
					post(URL_FORGET_PWD,data).then(res => {
						this.$router.push({ path: '/' });
					})
				}
			}
		}
	}
</script>