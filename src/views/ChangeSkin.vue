<template>
  <div >
     <div class="colorWrap">
      <div  v-for="(item,index) in colorList">
        <div class="colorBlock" :style="{ backgroundColor: `${item}`}" @click="changeItem(index)">
          <img class="imgStyle" :style="{display: skinColor === item ? 'block' : 'none'}" src="../assets/check.png" />
        </div>
      </div>
    </div>
    <box gap="100px 10px">
        <x-button :gradients="['#7aaee5', '#5e83cd']"
          @click.native="confirmChange"
        >确认</x-button>
      </box>
  </div>
</template>

<script >
  import { XButton, Box, } from 'vux';
  import { COLOR1, COLOR2, COLOR3, COLOR4, COLOR5, COLOR6 } from '@/utils/constants';

  export default { 
    components: {
      XButton, Box, 
    },
    data() {
      return {
        colorList: [COLOR1, COLOR2, COLOR3, COLOR4, COLOR5, COLOR6],
        skinColor: COLOR1,
      }
    },
    mounted() {
      this.skinColor = localStorage.getItem('skinColor');
    
    },
    methods: {
      changeItem(index) {
        this.skinColor = this.colorList[index];
      },
      confirmChange() {
         localStorage.setItem('skinColor',this.skinColor);
         this.$vux.toast.text('设置成功！', 'middle');
         setTimeout(() => {
            this.$router.push({ path: '/me' });
         },300);
      }
    }
  }
</script>

<style scoped>
  .colorWrap {
    display: flex;
    flex-direction: row;
    flex:1;
    margin: 15px;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .colorBlock {
    width: 80px;
    height: 80px;
    margin: 8px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .imgStyle {
    width: 25px;
    height: 25px;
  }
</style>