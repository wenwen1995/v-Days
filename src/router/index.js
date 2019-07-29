import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Record from '@/views/Record'
import Edit from '@/views/Edit'
import Me from '@/views/Me'
import ModifyPwd from '@/views/ModifyPwd'
import ForgetPwd from '@/views/ForgetPwd'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { title: '注册' }
    },
    {
      path: '/record',
      name: 'record',
      component: Record,
      meta: { title: '记录' }
    },
    {
      path: '/add',
      name: 'add',
      component: Edit,
      meta: { title: '添加' }
    },
    {
      path: '/me',
      name: 'me',
      component: Me,
      meta: { title: '我的' }
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit,
      meta: { title: '修改' }
    },
    {
      path: '/modifyPwd',
      name: 'modifyPwd',
      component: ModifyPwd,
      meta: { title: '修改密码' }
    },
    {
      path: '/forgetPwd',
      name: 'forgetPwd',
      component: ForgetPwd,
      meta: { title: '忘记密码' }
    },
  ]
});

//全局守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const token_exp = localStorage.getItem('token_exp');
  const now_time = new Date().getTime();
  console.log(now_time)
  const remainTime = now_time - token_exp; //剩余的时间
  const time_step = 120000; //2min
  // 90 * 24 * 60 * 60 * 1000; //3个月的时间，时间为毫秒级别
  const is_time_exceed = (token && remainTime >= time_step); //时间超过了3个月
    
  console.log('xx ===>',to, from,is_time_exceed)

  if(token && is_time_exceed){ //token 过期跳转到登录页面
    if(to.name === 'login') { 
      next();
      return;
    }else {
      next({ name: 'login' })
    }
    localStorage.clear();
  }else if(token && !is_time_exceed){ 
    if(to.name === 'login') {  //未过期。去->登录 返回->记录页
      next('/record');
    }else { //未过期 去->其他页，返回-> 其他页
      next();
    }
  }else {
    next();
  }

});

export default router;
