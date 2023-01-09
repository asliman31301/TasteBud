<template>
  <div class="card" style="margin:20px;">
    <div v-if="error" class="alert alert-warning" role="alert">
      {{ this.error }}
    </div>
    <h5 class="card-header">Account info</h5>
    <div class="card-body">
      <!-- Login Form -->
      <input
        type="text"
        id="userName"
        class="form-control my-2 "
        placeholder="Full Name"
        v-model="userAccountRequest.name"
      />
      <input
        type="text"
        id="userEmail"
       class="form-control  my-2 "
        name="userEmail"
        placeholder="email address"
        v-model="userAccountRequest.email"
      />
      <input
        type="password"
        id="password"
      class="form-control  my-2 "
        name="login"
        placeholder="password"
        v-model="userAccountRequest.password"
      />
      <input
        type="password"
        id="confirmPassword"
      class="form-control  my-2 "
        name="confirmPassword"
        placeholder="confirm password"
        v-model="userAccountRequest.confirmPassword"
      />
      <input
        type="button"
        value="Save Changes"
        class="form-control  my-2 btn btn-primary"
        
        @click="onSignUpClick"
      />
      <input
        type="button"
        value="Sign Out"
        class="form-control  my-2 btn btn-secondary"
        @click="onSignOutClick"
      />
      <input
        type="button"
        value="Delete Account"
         class="form-control  my-2 btn  btn-danger"
        @click="onDeleteAccountClick"
      />
    </div>
  </div>
</template>


<script>
import { firebaseApp } from "@/main.js";

export default {
  name: "AccountView",
  data() {
    return {
      error: null,
      userCredentails: {},
      userAccountRequest: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  mounted() {
    firebaseApp.getCurrentUser().then((user) => {
      this.userAccountRequest.name = user.displayName;
      this.userAccountRequest.password = "";
      this.userAccountRequest.confirmPassword = "";
      this.userAccountRequest.email = user.email;
    });
  },
  methods: {
    onDeleteAccountClick() {
      firebaseApp
        .auth()
        .currentUser.delete()
        .then(() => {
          this.$router.replace({ name: "signout" }).catch((err) => {
            console.warn(err);
          });
        });
    },
    onSignOutClick() {
      this.$router.replace({ name: "signout" }).catch((err) => {
        console.warn(err);
      });
    },
    onSignUpClick() {
      this.userCredentails = JSON.parse(localStorage.getItem("uc"));

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
      firebaseApp
        .auth()
        .signInWithEmailAndPassword(
          this.userCredentails.username,
          this.userCredentails.password
        )
        .then(() => {
          firebaseApp
            .auth()
            .currentUser.updateProfile({
              displayName: this.userAccountRequest.name,
            })
            .then(() => {
              this.error = "Your profile was updated successfully";
            })
            .catch((err) => {
              this.error = err.message;
            });

          firebaseApp
            .auth()
            .currentUser.updatePassword(this.userAccountRequest.password)
            .then(() => {
              localStorage.setItem("uc", {
                username: this.userAccountRequest.name,
                password: this.userAccountRequest.password,
              });
              this.error = "Your profile was updated successfully";
            })
            .catch((err) => {
              this.error = err.message;
              console.log(err);
            });
        })
        .catch((err) => {
          this.error = err.message.replace("Firebase: ", "");
        });
    },
  },
};
</script>

<style scoped>
.card-header{
  background: rgb(235, 226, 226);
}
</style>