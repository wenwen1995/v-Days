<template>
  <div class="tabbarStyle">
    <tabbar>
      <tabbar-item :selected="$route.name === 'record'"
                   :link="{name:'record'}" 
                   @on-item-click="currItemClick($route.name)">
      	<img slot="icon" src="../assets/record.png" />
      	<img slot="icon-active" src="../assets/recordActive.png" />
        <span slot="label">记录</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'add'" 
                   :link="{name:'add'}" 
                   @on-item-click="currItemClick($route.name)"
                   >
        <img slot="icon" src="../assets/add.png" >
        <img slot="icon-active" src="../assets/addActive.png" />
        <span slot="label">添加</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'me'" 
                   :link="{name:'me'}"
                   @on-item-click="currItemClick($route.name)"
                   >
        <img slot="icon" src="../assets/me.png" >
        <img slot="icon-active" src="../assets/meActive.png" />
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'

export default {
  name: 'BottomTab',
  components: {
    Tabbar,
    TabbarItem,
  },
  methods: {
    currItemClick(name) {
      console.log('name is ===>',name);
    }
  }
}
</script>
