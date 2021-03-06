import Vue from 'vue';
import store from './store.js';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Card from './views/Card.vue';
import History from './views/History.vue';
import User from './views/User.vue';
import Error from './views/500.vue';
import Contact from './views/Contact.vue';
import Transaction from './views/Transaction.vue';
import Payment from './views/Payment.vue';
import Recharge from './views/Recharge.vue';
import Notify from './views/Notify.vue';
import Notifies from './views/Notifies.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Trang chủ - Ebanking'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Đăng nhập - Ebanking'
      }
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: {
        requiresAuth: true,
        title: 'Lịch sử giao dịch'
      }
    },
    {
      path: '/card',
      name: 'card',
      component: Card,
      meta: {
        requiresAuth: true,
        title: 'Danh sách tài khoản'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        requiresAuth: true,
        title: 'Quản lí tài khoản',
        isAdmin: true
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      meta: {
        requiresAuth: true,
        title: 'Quản lí danh bạ',
      }
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction,
      meta: {
        requiresAuth: true,
        title: 'Chuyển tiền nội bộ',
      },
      props: true
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment,
      meta: {
        requiresAuth: true,
        title: 'Quản lí tài khoản thanh toán',
        isAdmin: true
      }
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: Recharge,
      meta: {
        requiresAuth: true,
        title: 'Nạp tiền',
        isAdmin: true
      }
    },
    {
      path: '/notify',
      name: 'notify',
      component: Notify,
      meta: {
        requiresAuth: true,
        title: 'Thông báo',
        isAdmin: true
      }
    },
    {
      path: '/notifies',
      name: 'notifies',
      component: Notifies,
      meta: {
        requiresAuth: true,
        title: 'Danh sách thông báo',
        isAdmin: true
      }
    },
    {
      path: '/404',
      name: '404',
      component: Error,
      meta: {
        title: 'Lỗi',
      }
    }, 
    {
      path: '*',
      redirect: '/404'
    },
  ]
});

// action before access page
router.beforeEach((to, from, next) => {
  // set title
  document.title = to.meta.title;
  if (store.getters.isLoggedIn) {
    store.dispatch('renew_token');
    // if (store.getters.currentUser == null) {
    //   store.dispatch('renew_token');
    // }
    // prevent access login page again while authentication successful
    if (to.name == 'login') {
      // no need to go to login page, if user is already logged in - redirect
      return router.push({ name: 'home' });
    }
  }

  // page requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // check login
    if (store.getters.isLoggedIn) {
      var user = store.getters.currentUser.user;
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (user.Permission == 1) {
          next();
        } else {
          next({ name: '404'});
        }
      } else {
        if (user.Permission == 0) {
          next();
        } else {
          next({ name: '404'});
        }
      }
    } else {
      // require login again
      next('/login');
    }
  } else {
    //go to next
    next();
  }
});

export default router;
