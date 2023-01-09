<template>
  <div class="wrapper">
    <div v-if="error" class="alert alert-warning" role="alert">
      {{ this.error }}
    </div>
    <div id="formContent">
      <h2 class="inactive"><a href="/login">Sign In</a></h2>
      <h2 class="active underlineHover"><a href="/register">Sign Up</a></h2>
      <!-- Login Form -->
      <input type="text" id="userName" class="fadeIn second" placeholder="Full Name"
        v-model="userAccountRequest.name" />
      <input type="text" id="userEmail" class="fadeIn second" name="userEmail" placeholder="email address"
        v-model="userAccountRequest.email" />
      <input type="password" id="password" class="fadeIn third" name="login" placeholder="password"
        v-model="userAccountRequest.password" />
      <input type="password" id="confirmPassword" class="fadeIn third" name="confirmPassword"
        placeholder="confirm password" v-model="userAccountRequest.confirmPassword" />
      <input type="button" value="Sign Up" class="fadeIn fourth" @click="onSignUpClick" />
      <!-- <div>
        <div class="btn btn-outline-dark googleButton" href="javascript:;" role="button" style="text-transform: none" @click="onGoogle">
          <img width="20px" style="margin-bottom: 3px; margin-right: 5px" alt="Google sign-in"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
          Sign up with Google
        </div>
      </div> -->
    </div>
  </div>
</template>


<script>
import { firebaseAuth } from "@/main.js";
import { fireStore } from "@/main";
import { GoogleAuthProvider } from "firebase/auth";
var provider = new GoogleAuthProvider();

export default {
  name: "RegisterUser",
  data() {
    return {
      error: null,
      userAccountRequest: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      model: {
        filters: {
          distance: 5,
          useLocation: true,
          manualLocation: "",
          selectedImages: [],
          manualSearch: ""
        },
        likedCards: []
      }
    };
  },
  methods: {
    onSignUpClick() {
      if (!this.userAccountRequest.name) {
        this.error = "Missing full name";
        return;
      }
      if (!this.userAccountRequest.email) {
        this.error = "A valid email address is required";
        return;
      }
      if (!this.userAccountRequest.password) {
        this.error = "A password is required";
        return;
      }

      if (
        this.userAccountRequest.password !==
        this.userAccountRequest.confirmPassword
      ) {
        this.error = "Password and Confirm password are not equal";
        return;
      }

      firebaseAuth
        .createUserWithEmailAndPassword(
          this.userAccountRequest.email,
          this.userAccountRequest.password
        )
        .then((data) => {
          data.user
            .updateProfile({
              displayName: this.userAccountRequest.name
            })
            .then(() => {

              fireStore.collection("TasteBudUsers").doc(data.user.uid).set(this.model).then(() => {
                this.$router.replace({ name: "login" }).catch((err) => {
                  console.warn(err);
                });
              });
              // fireStore.collection("userSettings").doc("filters").set(this.model).then(() => history.pushState(null, "", "./home"));

            });
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    onGoogle(){
    firebaseAuth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  },
}
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");


a {
  color: #92badd;
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}

/* STRUCTURE */
.googleButton {
  padding: 10px 20px;
  margin-bottom: 10px;
}

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}

/* TABS */

h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}

/* FORM TYPOGRAPHY*/

input[type="button"],
input[type="submit"],
input[type="reset"] {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type="button"]:hover,
input[type="submit"]:hover,
input[type="reset"]:hover {
  background-color: #39ace7;
}

input[type="button"]:active,
input[type="submit"]:active,
input[type="reset"]:active {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type="text"],
input[type="password"] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type="text"]:placeholder,
input[type="password"]:placeholder {
  color: #cccccc;
}

/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;

  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

.underlineHover:hover:after {
  width: 100%;
}

/* OTHERS */

*:focus {
  outline: none;
}

#icon {
  width: 60%;
}

* {
  box-sizing: border-box;
}
</style>