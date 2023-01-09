import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';

import { CurvedBottomNavigation } from "bottom-navigation-vue";

import './registerServiceWorker';
import router from './router';
import store from "./store";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//Tell the vue we want to use the bottom navigation 
//bar
Vue.use(CurvedBottomNavigation);
//Tell vue to use bootstrap
Vue.use(BootstrapVue);
Vue.config.productionTip = false;


//Firebase configuration , this should be masked a little 
const firebaseConfig = {
    apiKey: "AIzaSyBV5pZM5VUk0t_AFj7Ej5BF0hkPZmBH_EQ",
    authDomain: "tastebud-131a0.firebaseapp.com",
    projectId: "tastebud-131a0",
    storageBucket: "tastebud-131a0.appspot.com",
    messagingSenderId: "838448099428",
    appId: "1:838448099428:web:f9c39e148ed85e6e792f71",
    measurementId: "G-MFMTJSJDHB"
};

//grab the firebase context and export it so it can be used 
//in other components using (import firebaseApp from 'path/to/main')
export const firebaseApp = firebase.initializeApp(firebaseConfig);
//get the auth context and export for user
export const firebaseAuth = firebaseApp.auth();
export const fireStore = firebaseApp.firestore();
//Get create a getCurrentUser promise this 
//will allow us to repond to the change in user state
//this can be called from any component but 
// it will be called form the router.
firebaseApp.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        //subscribe to the onAuthStateChange event from firebase
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            //When firebase noties us of the an auth state change dispatch 
            //the change into the state store
            store.dispatch("fetchUser", user);
            //no more need to subscribe to this event , lets unsubscribe and resolve the promise
            unsubscribe();
            resolve(user);
        }, reject);
    })
};


//Create a new insteance of the VUE application
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')