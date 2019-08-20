<template>
  <scroller 
    ref="my_scroller"
    :on-refresh="refresh"
    :on-infinite="infinite"
    :minContentHeight="-1" 
    loading-layer-color="#eee"
    >
    <div class="searchWrap">
      <x-input placeholder="请输入搜索内容..." v-model="searchValue" :debounce="500" @on-change="fetchData(1)">
        <img slot="label" style="padding-right:10px;display:block;" src="../assets/search.png" width="24" height="24">
      </x-input>
    </div>

  	<div class="contentWrap">
  	  <div class="recordWrap" v-for="(item,index) in list">
        <div :style="showContentStyle(item)" class="content">
        	<x-icon type="ios-close" size="30" class="deleteIcon" @click="onDeleteCurr(item._id)"></x-icon>
        	<div  @click="onGoDetail(item)">
  	        <p>
  	          {{ item.title }} 
  	        </p>
  	        <div class="goDays">
              <span class="directorText">{{ item.setTimeStamp < Date.now() ? '已经' : '剩余'}}</span>
             {{ caculateDays(item.setTimeStamp) }} 天
            </div>
  	        <div class="description">{{ item.description }}</div>
  	        <br/>
  	        <span class="settingTime">距离 {{ formateDate(item.setTimeStamp) }}</span>
  	      </div>
        </div>
  	  </div>      
  	</div>
  </scroller>
</template>

<script>
import { dateFormat, XInput  } from 'vux';
import { URL_GET_RECORD_LIST, URL_DELETE_RECORD } from '@/utils/constants';
import { get, post } from '@/utils/request';
import { translatorRecordList } from '@/utils/translator';

//背景色list
const bgColorOptions = ['#90829E','#F29F8C','#FFCCCC',
                        '#99CCCC','#3399CC','#99CCFF',
                        '#CC9B6A','#2DB3A0'
                       ]

export default {
  components: {
    XInput
  },
  name: 'Record',
  data () {
    return {
      list: [],
      bgColorOptions,
      page: 1, //当前第几页
      pageSize: 5,  //每次请求多少条
      total: 0, //总页数
      pageNum: 0, //当前获取返回数据的数量
      searchValue: '', //搜索的值
    }
  },
  created() {
  	this.$vux.loading.show({
		 text: '加载中...'
		},'middle');
  },
  mounted() { 
    this.fetchData();
  }, 
  methods: {
    showContentStyle(item) {
      if(item.filePath) { //有上传图片，则默认背景显示图片
        return {
          backgroundImage: `url('${item.filePath}')`,
          backgroundSize: '100% 100%',
        }
      }else { //无图片，默认从bgColorOptions随机选取颜色显示
        return {
          backgroundColor: `${bgColorOptions[Math.floor(Math.random() * 8)]}`
        }
      }
    },
    refresh(done){
      setTimeout(() => {
        this.pageNum = 0;
        this.page = 1;
        this.fetchData();
        done();
      },1500);
    },
    infinite(done) {
      const that = this;
      const { total, pageNum } = that;
      //请求数量大于等于返回数量或者返回数量为0
      if(pageNum >= total || !total) {
        setTimeout(() => {
          that.$refs.my_scroller.finishInfinite(true);
        },800);
      }

      if(pageNum < total) {
        setTimeout(() => {
          that.page ++;
          that.fetchData(that.page, true);
          done();
        },1500);
      }
    },
    fetchData(page = 1,fromLoadMore = false) {
      const phoneNumber = localStorage.getItem('phoneNumber');
      const { pageSize, searchValue, } = this;
      const url = `${URL_GET_RECORD_LIST}?page=${page}&pageSize=${pageSize}&phoneNumber=${phoneNumber}&searchValue=${searchValue}`;
      get(url).then((res) => {
        const { list, total } = res.data;
        const newList = translatorRecordList(list);
        this.pageNum += newList.length;
        if(fromLoadMore) {
          this.list = this.list.concat(newList);
        }else {
          this.list = newList;
        }
        this.total = total;
        this.$vux.loading.hide();
      }).catch(err => {
        this.$vux.loading.hide();
      })
    },
  	formateDate(timeStamp) {
	   const myDate = new Date(timeStamp);
	   const year = myDate.getFullYear();
	   let month = myDate.getMonth() + 1 ;
	   let day = myDate.getDate();
	   month = month < 10 ? `0${month}` : `${month}`;
	   day = day < 10 ? `0${day}` : `${day}`;
	   const dateStr = `${year}-${month}-${day}`;
	   return dateStr;
	},
  //计算天数，可能是剩余多少天，也可能是已经多少天
	caculateDays(setTimeStamp) {
		const nowStamp = Date.now();
		const remainderStamp = (nowStamp - setTimeStamp) > 0 ? (nowStamp - setTimeStamp) : (setTimeStamp - nowStamp);
		const remainderDays = Math.floor(remainderStamp / (24 *60 *60 *1000));
		return remainderDays;
	 },
	 onGoDetail(data) {
	 	this.$router.push({
	 		name: 'edit',
	 		query: { ...data,id: data._id }
	 	})
	 },
	 onDeleteCurr(id) {
     post(URL_DELETE_RECORD,{ id })
         .then((res) => {
          this.fetchData();
        });
	 },
  }
}
</script>


<style scoped>
 .recordWrap {
   position: relative;
   z-index: 1;
 	 margin: 10px;
 }

 .wrap {
 	height: 180px;
 	margin-top: 10px;
 }

 .content {
  padding: 14px;
  font-size: 18px;
  color: #fff;
  position: relative;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0px 0px 10px lightslategrey;
 }

 .deleteIcon {
 	position: absolute;
 	right: -8px;
  top: -10px;
  display: block;
  fill: #fff;
 }

 .directorText {
  font-size: 14px;
 }

 .goDays {
 	font-size: 36px;
 	border-bottom: 1px dashed #fff;
 }

 .description {
 	font-size: 12px;
 	color: #fff;
 	width: 100%;
 	overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
 }

 .settingTime {
 	 font-size: 16px;
 }

 .searchWrap {
   border: 1px solid lightgray;
   border-radius: 7px;
   margin: 50px 5px 0 5px;
 }
</style>

