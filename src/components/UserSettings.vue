<template>
  <div class="card" style="margin: 20px">
    <h5 class="card-header">Settings</h5>
    <div class="card-body">
      <h5 class="card-title">Location</h5>
      <div class="input-group">
        <input type="text" v-model="model.filters.manualLocation" :disabled="model.filters.useLocation"
          class="form-control form-control-sm" placeholder="City,State,Postal Code or use location"
          aria-label="Enter City, State or Postal Code" aria-describedby="btnGroupAddon2" />
        <div class="input-group-text" id="btnGroupAddon2">
          <i class="fa-solid fa-map-pin"></i>&nbsp;<input type="checkbox" v-model="model.filters.useLocation" />
        </div>
        <div class="input-group-text" id="btnGroupAddon2">
          <i class="fa-solid fa-earth-americas"></i>
        </div>
      </div>
      <div class="mt-2">
        <h5 class="card-title">
          Distance Preference {{ model.filters.distance }} miles
        </h5>
        <input type="range" v-model="model.filters.distance" @change="onDistanceChange" class="form-range" id="customRange1" />
      </div>
      <h5 class="card-title">Manual Search</h5>
      <div class="input-group">
        <input type="text" v-model="model.filters.manualSearch"
          class="form-control form-control-sm" placeholder="What are you hungry for?"
          aria-label="What are you hungry for?" aria-describedby="btnGroupAddon2" />
        <div class="input-group-text" id="btnGroupAddon2" @click="onApplyClick">
          <i class="fa-solid fa fa-check-circle"></i>
        </div>
      </div>
      <div class="mt-2">
        <h5 class="card-title">Restaurant Preferences</h5>
        <div class="foodSelector">
          <vue-select-image  :dataImages="dataImages" :is-multiple="true" :selectedImages="model.filters.selectedImages"
            :useLabel="true" @onselectmultipleimage="onSelectMultipleImage" >
          </vue-select-image>
        </div>
      </div>
      <div>
        <button class="form-control my-2 btn btn-secondary" @click="onApplyClick">
          Apply
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { fireStore } from "@/main";
import { firebaseAuth } from "@/main.js";
import { CurvedBottomNavigation } from "bottom-navigation-vue";

import VueSelectImage from "vue-select-image";
import VueRouter from 'vue-router'
import("vue-select-image/dist/vue-select-image.css");
import globals from "@/globals";
export default {
  components: {
    VueSelectImage,
  },
  data() {
    return {
      dataImages: [
        { id: "1", alt: "Asian", src: "img/foodIcons/asian.png" },
        { id: "2", alt: "Breakfast", src: "img/foodIcons/breakfast.png" },
        { id: "3", alt: "Fast Food", src: "img/foodIcons/fastfood.png" },
        { id: "4", alt: "Burgers", src: "img/foodIcons/hamburger.png" },
        { id: "5", alt: "Mexican", src: "img/foodIcons/mexican.png" },
        { id: "6", alt: "Pizza", src: "img/foodIcons/pizza.png" },
        { id: "7", alt: "Seafood", src: "img/foodIcons/seafood.png" },
        { id: "8", alt: "Steak", src: "img/foodIcons/steak.png" },
        { id: "9", alt: "Vegan", src: "img/foodIcons/vegan.png" },
        { id: "10", alt: "Chicken", src: "img/foodIcons/chicken.png" },
        { id: "11", alt: "Mid.Eastern", src: "img/foodIcons/gyro.png" },
        { id: "12", alt: "Bakery", src: "img/foodIcons/bakery.png" },
        { id: "13", alt: "Bar", src: "img/foodIcons/beer.png" },
        { id: "14", alt: "Italian", src: "img/foodIcons/spaghetti.png" }

        
      ],

      model: {
        filters:{
          distance: 5,
          useLocation: true,
          manualLocation: "",
          selectedImages: [],
          manualSearch: ""
        },     
      },
    };
  },
  mounted() {
    var ref = fireStore.collection("TasteBudUsers").doc(firebaseAuth.currentUser.uid);
    /*eslint-disable */
    ref.get().then((doc) => {
      if (doc.exists) {
         console.log(doc.data()); 
         this.model = doc.data();
         console.log("Document data:", this.model.filters.selectedImages.map((x) => x.alt));
      } else {
        // doc.data() will be undefined in this case
        console.log(firebaseAuth.currentUser);
        fireStore.collection("TasteBudUsers")
               .doc(firebaseAuth.currentUser.uid)
               .set(this.model)
               .then();
        console.log("No such document!");
      }
    })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  },
  methods: {
    onDistanceChange(e) {
      console.log(e, this.model.filters.distance);
    },
    onApplyClick() {
      // eslint-disable-next-line
      console.log('made it')
      globals.selectedTab = 1;
      
      fireStore.collection("TasteBudUsers")
               .doc(firebaseAuth.currentUser.uid)
               .set(this.model)
               .then(() => history.pushState(null, "", "./home"));
      this.$router.push({ path: "/home", replace: true });
      
    },
    onSelectMultipleImage(selected) {
      this.model.filters.manualSearch = "";
      this.model.filters.selectedImages = selected;
      console.log(this.model.filters.selectedImages);
    },

  },
};
</script>
<style >
.card-header {
  background: rgb(235, 226, 226);
}

.selectedImages {
  padding: auto;
}

.vue-select-image__thumbnail {
  align-content: center;
  text-align: center;
  width: 90px !important;
}

.vue-select-image__item {
  margin: 0 10px 12px 0 !important;
  float: left;
  width: 90px;
}

.card {
  height: 85vh;
}

.foodSelector {
  height: 30vh;
  overflow: auto;
}
</style>