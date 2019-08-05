import { URL_GET_SELECT_COLOR, URL_CONFIRM_SELECT_COLOR } from '@/utils/constants';
import { post } from '@/utils/request';


const skin = {
  state: {
    skinColor: '', //默认皮肤颜色为蓝色
  },
  getters: {
    getChooseSkinColor(state) {
      return state.skinColor;
    }
  },
  actions: {
    setSkinColor({ commit },data) {
      return new Promise((resolve,reject) => {
        post(URL_CONFIRM_SELECT_COLOR,{ ...data })
            .then(res => {
             commit('setSelectSkinColor',data);
              resolve(res);
            }).catch(err => {
              console.log('x ==>',err);
              reject(err);
            })
      });
    },
    getSkinColor({ commit },data) {
      return new Promise((resolve,reject) => {
        post(URL_GET_SELECT_COLOR,{ ...data })
          .then(res => {
            commit('setSelectSkinColor',res.data);
            resolve(res);
          }).catch(err => {
            reject(err);
            console.log('x ==>',err);
          })
      });
    }
  },
  mutations: {
    setSelectSkinColor(state,data) {
      const { skinColor } = data;
      state.skinColor = skinColor;
    },
  },
};

export default skin;