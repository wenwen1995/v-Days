<template>
  <div class="tabbarStyle">
    <tabbar>
      <tabbar-item :selected="$route.name === 'record'"
                   :link="{name:'record'}" 
                   >
      	<img slot="icon" src="../assets/record/record.png" />
      	<img slot="icon-active" :src="recordActive" />
        <span slot="label" :style="{ color: $route.name === 'record' ? `${skinColor}` : '#999'}">记录</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'add'" 
                   :link="{name:'add'}" 
                   
                   >
        <img slot="icon" src="../assets/add/add.png" >
        <img slot="icon-active" :src="addActive" />
        <span slot="label" :style="{ color: $route.name === 'add' ? `${skinColor}` : '#999'}">添加</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'me'" 
                   :link="{name:'me'}"
                   
                   >
        <img slot="icon" src="../assets/me/person.png" >
        <img slot="icon-active" :src="personActive" />
        <span slot="label" :style="{ color: $route.name === 'me' ? `${skinColor}` : '#999'}">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux';
import { COLOR1, COLOR2, COLOR3, COLOR4, COLOR5, COLOR6 } from '@/utils/constants';

import Person from '@/assets/me/person.png';
import Person1 from '@/assets/me/person1.png';
import Person2 from '@/assets/me/person2.png';
import Person3 from '@/assets/me/person3.png';
import Person4 from '@/assets/me/person4.png';
import Person5 from '@/assets/me/person5.png';
import Person6 from '@/assets/me/person6.png';

import Add from '@/assets/add/add.png';
import Add1 from '@/assets/add/add1.png';
import Add2 from '@/assets/add/add2.png';
import Add3 from '@/assets/add/add3.png';
import Add4 from '@/assets/add/add4.png';
import Add5 from '@/assets/add/add5.png';
import Add6 from '@/assets/add/add6.png';

import Record from '@/assets/record/record.png';
import Record1 from '@/assets/record/record1.png';
import Record2 from '@/assets/record/record2.png';
import Record3 from '@/assets/record/record3.png';
import Record4 from '@/assets/record/record4.png';
import Record5 from '@/assets/record/record5.png';
import Record6 from '@/assets/record/record6.png';

export default {
  name: 'BottomTab',
  components: {
    Tabbar,
    TabbarItem,
  },
  props: {
    skinColor: {
      type: String,
      default: "",
    }
  },
  data() {
   return {
     personActive: Person1,
     addActive: Add1,
     recordActive: Record1,
   }
  },
  updated() {
    let { skinColor, } = this;
    const mySelf = this;
    const handleColorRelated = [
      { color: COLOR1, personActive: Person1, addActive: Add1, recordActive: Record1 },
      { color: COLOR2, personActive: Person2, addActive: Add2, recordActive: Record2 },
      { color: COLOR3, personActive: Person3, addActive: Add3, recordActive: Record3 },
      { color: COLOR4, personActive: Person4, addActive: Add4, recordActive: Record4 },
      { color: COLOR5, personActive: Person5, addActive: Add5, recordActive: Record5 },
      { color: COLOR6, personActive: Person6, addActive: Add6, recordActive: Record6 },
    ];

    handleColorRelated.some(item => {
      const { color, personActive, addActive, recordActive } = item;
      if(color === skinColor) {
        mySelf.personActive = personActive;
        mySelf.addActive = addActive;
        mySelf.recordActive = recordActive;
      }
    });
  }
}
</script>
