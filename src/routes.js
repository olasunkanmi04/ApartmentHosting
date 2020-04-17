import Vue from 'vue'
import Router from 'vue-router'
import Home from './home'
import firstStep from './Listing'
import Register from './register'
import Login from './components/register/login'
import SignUp from './components/register/signup'
import FgtPword from './components/register/forgetPword'
import newPword from './components/register/newPassword'
import checkVerified from './components/register/checkVerify'
import listingStatus from "./listingBreakdown"
import secondStep from "./listing-stepTwo"
import thirdStep from "./listing-stepThree"
import dashboard from './dashboard'
import listingView from './components/dashboard/listingView'
import bookings from './components/dashboard/bookings'
import subscriptions from './components/dashboard/subscriptions'
import memberSubDetails from './components/dashboard/memberSubDetails'
import listing from './allListing'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/register',
    component: Register,

    children: [{
      path: '',
      component: Login,
      name: 'Login',
      meta: {
        guest: true
      }
    },
    {
      name: 'register',
      path: 'signup',
      component: SignUp,
      meta: {
        guest: true
      }
    },
    {
      name: 'fgtPword',
      path: 'forgetPword',
      component: FgtPword
    },
    {
      name: 'newPword',
      path: 'newPassword',
      component: newPword
    },
    {
      name: 'verified',
      path: 'checkVerify',
      component: checkVerified,
      meta: {
        verified: true
      }
    }
    ]

  },
  {
    path: '/breakdown/:id',
    name: 'Listing Status',
    component: listingStatus,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/listing',
    component: listing,

    children: [
      {
        path: ':id',
        name: 'first-step',
        component: firstStep,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'second-step/:id',
        name: 'second-step',
        component: secondStep,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'third-step/:id',
        name: 'third-step',
        component: thirdStep,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: dashboard,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '',
      component: listingView,
      name: "dashboard",
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'bookings',
      component: bookings,
      name: "bookings",
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'subscriptions',
      component: subscriptions,
      name: "subscriptions",
      meta: {
        requiresAuth: true
      }
      // children: []
    },
    {
      path: 'memberSubDetails/:id',
      component: memberSubDetails,
      name: "memberSubDetails",
      meta: {
        requiresAuth: true
      },
    }
    ]
  },
  ]
});

router.beforeEach((to, from, next) => {
  let user = JSON.parse(localStorage.getItem('user'));
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (user && user.user.is_verified) {
      return next()
    }
    if (user && !user.user.is_verified) {
      return next('/register/checkVerify');
    } else {
      return next('/register');
    }
    // if (!user) {
    //   return next('/register');
    // } else if (user && user.user.is_verified == null) {

    //   return next('/register/checkVerify');
    // } else if (user && user.user.is_verified == true) {
    //   return next('/');
    // }
  } else {
    next() // make sure to always call next()!
  }
  if (to.matched.some(record => record.meta.guest)) {
    if (user) {
      return next('/')
    } else {
      next()
    }
  }

  if (to.matched.some(record => record.meta.verified)) {
    if (user) {
      if (!user.user.is_verified) {
        return next('/register/checkVerify');
      } else {
        return next()
      }
    } else {
      next('/register')
    }
  } else {
    return next();
  }
})

export default router
