<template>
  <div>
    <div class="alert alert-success" role="alert">
      You have been signed out successfuly.
    </div>
  </div>
</template>
<script>
import { firebaseAuth } from "@/main.js";
export default {
  created() {
    localStorage.removeItem("uc");
    firebaseAuth.signOut().then(() => {
      this.$router.replace({ name: "login" }).catch((err) => {
        console.warn(err);
      });
    });
  },
};
</script>
<style scoped>
</style>