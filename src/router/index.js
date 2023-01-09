import Vue from 'vue';
import VueRouter from 'vue-router';

import RegisterUser from '../views/RegisterUser.vue';
import SignOut from '../views/SignOut.vue';
import LoginUser from '../views/LoginUser.vue';
import AccountView from '../views/AccountView.vue';
import { firebaseApp } from "@/main.js";
Vue.use(VueRouter)

//consturct the routes here 
const routes = [{
            path: '*', //Catch all route, this will default all unknow routes to the login screen
            redirect: 'login'
        },
        {
            path: '/', //if accessing the root of the application go to login , this will get forwarded to home should the user be authenticated
            redirect: '/login'
        },
        {
            path: '/login', //good measure to create a login route , this will allow users to share the link directly to the log in page
            name: 'login',
            component: LoginUser
        },
        {
            path: '/register', //registration form
            name: 'RegisterUser',
            component: RegisterUser
        },
        {
            path: '/account', //registration form
            name: 'Account',
            component: AccountView
        },
        {
            path: '/signout', //registration form
            name: 'signout',
            component: SignOut
        },
        {
            path: '/home', //main home component 
            name: 'home',
            //using the lazy load here , not pulling the actual view until it is required
            component: () =>
                import ('@/views/HomeView.vue'),
            meta: {
                //specifying these meta tags here allows us to gaurd these routes 
                //this says dont let this route show unless the user has been authenticated 
                requiresAuth: true
            }
        },
        {
            path: '/LikedResturants',
            name: 'LikedResturants',
            meta: {
                requiresAuth: true
            },
            component: () =>
                import ('../views/LikedResturants.vue')
        },
        {
            path: '/Settings',
            name: 'Settings',
            meta: {
                requiresAuth: true
            },
            component: () =>
                import ('../views/SettingsView.vue')
        }
    ]
    //create an instance of the vue router and set up the base url to '/'
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

//attach to the before each route event 
//this is where we can check if the user is authenticated and 
//allow them to continue on to the requested route
router.beforeEach(async(to, from, next) => {
    //check if the requested route has the meta tag for 'requiresAuth'
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    //if the route requires authentication and the the fire base context 
    //does not have a logged in user then go to the login screen 
    //otherwise move to the route the was requested 
    //using the "await" keyword here allows the getCurrentUser promise to 
    //complete before continuing 
    if (requiresAuth && !await firebaseApp.getCurrentUser()) {
        next('login');
    } else {
        next();
    }
});

export default router