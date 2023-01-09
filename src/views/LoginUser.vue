<template>
  <div>
    <div v-if="error" class="alert alert-warning" role="alert">
      {{ this.error }}
    </div>
    <UserLoginForm v-if="!this.autoLogin" @onUserLoginClick="authunticateUser" />
  </div>
</template>
<script>
/* eslint-disable */
import { firebaseAuth } from "@/main.js";
import { fireStore } from "@/main";
import UserLoginForm from "@/components/UserLoginForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "LoginUser",
  data() {
    return {
      error: "",
      autoLogin: false,
      userCredentails: {
        username: "",
        password: "",
        isGoogle: false, 
        uid: ""
      },
    };
  },
  created() {
    this.userCredentails = JSON.parse(localStorage.getItem("uc"));
    console.log(this.userCredentails); 
    if (this.userCredentails) {
      this.autoLogin = true;
      this.authunticateUser(this.userCredentails);
    }
  },
  components: {
    UserLoginForm,
  },
  methods: {
    getUserData(uid){
      var ref = fireStore.collection("TasteBudUsers").doc(uid);
            ref.get()
              .then((doc) => {
                if (doc.data()) {
                  if (doc.data().likedCards) {
                    this.$router.replace({ name: "home" }).catch((err) => {
                      console.warn(err);
                    });
                    return;
                  } else {
                    fireStore.collection("TasteBudUsers")
                      .doc(uid)
                      .set(data)
                      .then()
                      .catch((err) => {
                        console.log("inner Catch", err, data);
                      });
                    this.$router.replace({ name: "home" }).catch((err) => {
                      console.warn(err);
                    });
                  }
                }
              })
              .catch((err) => {
                console.log("outer catch", err)
              });
    },
    authunticateUser(userCredentails) {
      if (userCredentails.isGoogle === true) {
        this.getUserData(userCredentails.uid)
      } else {
        if (!userCredentails.password || !userCredentails.username) {
          this.error = "Invalid user or password";
          return;
        }
        firebaseAuth
          .signInWithEmailAndPassword(
            userCredentails.username,
            userCredentails.password
          )
          .then((data) => {
            this.getUserData(firebaseAuth.currentUser.uid);
          })
          .catch((err) => {
            this.error = err.message.replace("Firebase: ", "");
          });
      }

    },
  },
};
</script>