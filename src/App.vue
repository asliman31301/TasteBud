<template>
  <div id="app">
    <div v-if="updateExists" class="alert alert-info updateAlert" role="alert">
      <span><i class="fas fa-bell mx-2"></i></span>
      <span class="mr-4"> A new update is available </span>
      <button type="button" class="btn btn-sm btn-danger btn-update mx-4" data-bs-dismiss="alert" aria-label="Close"
        @click="refreshApp">
        Update
      </button>
    </div>
    <keep-alive include="HomeView">
      <router-view />
    </keep-alive>

    <CurvedBottomNavigation v-if="user.loggedIn" :options="options" :badge-color="badgeColor"
      :foreground-color="foregroundColor" :background-color="backgroundColor" :icon-color="iconColor"
       v-bind="selected" v-model="selected" />
  </div>
</template>

<script>
import { CurvedBottomNavigation } from "bottom-navigation-vue";
import { mapGetters } from "vuex";
import globals from "@/globals";
// import update from "./mixins/update";

/* eslint-disable */
export default {
  name: "App",
  components: {
    CurvedBottomNavigation,
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  created() {
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    globals.selectedTab = 1;
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      });
    }
  },
  data: () => ({
    authenticated: false,
    selected: 1,
    options: [
      {
        id: 1,
        icon: "fas fa-utensils",
        title: "Home",
        color: "#5639af",
        path: { name: "home" },
      },
      {
        id: 2,
        icon: "fas fa-heart",
        title: "Liked",
        path: { name: "LikedResturants" },
      },
      {
        id: 4,
        icon: "fas fa-gear",
        title: "Settings",
        color: "#4493a7",
        path: { name: "Settings" },
      },
      {
        id: 5,
        icon: "fas fa-user",
        title: "Account",
        path: { name: "Account" },
      },
    ],
    foregroundColor: "#FAEBD7",
    badgeColor: "#FBC02D",
    backgroundColor: "#FFFFFF",
    iconColor: "#0D0D0D",
    refreshing: false,
    registration: null,
    updateExists: false,
  }),
  mounted() {
    // this.$root.$on('selected', data => {
    //   // trigger a function within Cart.vue
    //   // this.selected = 1;
    //   // console.log(this.selected);
    //   // console.log(data);
    //   CurvedBottomNavigation.update(1);
    // });
  },
  watch: {
    $route(route) {
      if (route.name) {
          switch (route.name) {
            case 'home':
              this.selected = 3;
            case 'LikedResturants':
              this.selected = 2;
            case 'Settings':
              this.selected = 3;
          }
        }
    }
  },
  // mixins: [update],
  methods: {
    showRefreshUI(e) {
      this.registration = e.detail;
      this.updateExists = true;
    },
    refreshApp() {
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
    setSelected(x) {
      this.selected = x;
    }
  },
};
</script>

<style>
.btn-update {
  margin-left: 10px;
}

.updateAlert {
  z-index: 500;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* color: #2c3e50; */
}
</style>
