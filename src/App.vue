<template>
  <div id="app" >
    <div v-if="!isHideHeader" class="headerStyle">
      <x-header :style='{backgroundColor: `${skinColor}`}' :left-options="{showBack: showBack}" >{{headerTitle}}</x-header>
    </div>
    <router-view :key="$route.name"></router-view>
    <div v-if="isShowBottomTab" >
      <bottom-tab :skinColor="skinColor" />
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import BottomTab from './components/Tarbar';

export default {
  name: 'App',
  components: {
    BottomTab,
    XHeader
  },
  data() {
    return {
      headerTitle: '',
      isShowBottomTab: false, //是否显示bottom tab
      showBack: false, //是否显示返回按钮
      isHideHeader: false, //是否隐藏header,登录页隐藏
      skinColor: '#4990ee', 
    }
  },
  mounted() {
    const { meta, path } = this.$route;
    this.headerTitle = meta.title;
    this.handleShowBottomTab(path);
    this.isHideHeader = (path === '/');
  },
  methods: {
    handleShowBottomTab(path) {
       const condition = (path === '/record') || (path === '/add') || (path === '/me');
       this.isShowBottomTab = condition;
    },
  },
  watch: {
    '$route' (to, from) {
      const { meta,path } = to;
      this.headerTitle = meta.title;
      //注册、修改密码、修改记录展示返回按钮 
      this.showBack = (path === '/register') || (path === '/modifyPwd') || (path === '/edit') || (path === '/forgetPwd') || (path === '/changeSkin'); 
      this.handleShowBottomTab(path);
      this.isHideHeader = (path === '/');
    },
  },
  updated() {
    this.skinColor = localStorage.getItem('skinColor');
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
*{ touch-action: none; } 

.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #4990ee !important;
}

.weui-tabbar{
position: fixed !important;
bottom: 0 !important;
z-index: 50 !important;
}

.vue-label {
  color: #999;
}

</style>

<style scoped>
.headerStyle {
  position: relative;
  z-index: 100;
}


</style>
