<template>
  <div >
  	<div class="logoWrap">
  	  <div class="logo">v-Days</div>
  	</div>
  	<box gap="100px 10px">
	    <group label-width="5.5em" label-margin-right="2em" >
        <div @click="goModifyPwd">
	    	  <cell title="修改密码" is-link ></cell>
        </div>
        <div @click="changeSkin">
          <cell title="换肤" is-link ></cell>
        </div>
        <div @click="showMeDialog">
	    	  <cell title="关于" is-link></cell>
        </div>
	    </group>
	  </box>
	  <box gap="80px 10px">
	  	<group label-width="5.5em" label-margin-right="2em" >
        <div @click="logout">
		      <cell title="退出" is-link></cell>
        </div>
		  </group>
		</box>
    <x-dialog v-model="isShowDialog" >
      <div class="dialogWrap">
         <h3 class="dialogTitle">v-Days </h3>
         <div class="dialogContent">
           <p>记录简单生活,</p>
           <p>偶尔的小确幸日子,</p>
           <p>一起编织成,</p>
           <p>最美的篇章...</p>
        </div>
       </div>
      <div @click="isShowDialog=false">
         <span class="vux-close"></span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Group, Cell, Box, XDialog, } from 'vux'
import { COLOR1 } from '@/utils/constants';


export default {
  components: {
  	Group, Cell, Box, XDialog,
  },
  name: 'Me',
  data () {
    return {
      isShowDialog: false,
    }
  },
  methods: {
    goModifyPwd() {
      this.$router.push({ path: '/modifyPwd' });
    },
    showMeDialog() {
      this.isShowDialog = true;
    },
    logout() {
      localStorage.clear();
      localStorage.setItem('skinColor',COLOR1);
      this.$router.push({ path: '/' });
    },
    changeSkin() {
      this.$router.push({ path: '/changeSkin' });
    }
  }
}
</script>


<style lang="less" scoped>
@import "~vux/src/styles/close";

.logoWrap {
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
.dialogWrap {
  height: 300px;
}
.dialogTitle {
  color: skyblue;
  padding: 20px;
}
.dialogContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 228px;
  color: darkgrey
}
</style>
