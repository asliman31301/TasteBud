<template>
  <div>

    <div class="input-group searchbar">
      <input id="searchbox" type="text" class="form-control form-control-sm" placeholder="Search for card" aria-label="Search for card"
        aria-describedby="btnGroupAddon2" />
      <div class="input-group-text" id="btnGroupAddon2" @click="onApplyClick">
        <i class="fa-solid fa fa-search"></i>
      </div>
    </div>
    <!--<button type="button">Remove</button>-->
    <!-- <button type="button" @click="shuffle">Shuffle</button> -->

    <ul>
      <transition-group name="list" tag="ul">
        <li v-for="(item,index) in this.model" :key="index" class="list-item">
          <div class="resturant__card">
            <div style="height: 100%">
              <div class ="trash" @click="removeCard(item)">
                <i class="fa fa-trash fa-2x" aria-hidden="true"></i>
              </div>
              <ImageSlider :images="item.photos" />
              <!-- <div class="resturant__card__btm"> -->

              <div class="resturantInfo">
                <div class="resturant__card__we">{{ item.name }}</div>

                <div>
                  <i class="fas fa-map-marker-alt"></i>
                  <a class="mapLink" :href="`https://www.google.com/maps/search/?api=1&query=${item.vicinity}`">{{
                  item.vicinity }}</a>
                </div>
                <div class="phoneNumber">
                  <a class="phoneLink" :href="'tel:+1' + item.phoneNumber">{{
                  item.phoneNumber
                  }}</a>
                </div>
                <div>
                  {{ item.rating }}&nbsp;&nbsp;
                  <star-rating :inline="true" :rating="item.rating" :read-only="true" :increment="0.01" :star-size="20"
                    :showRating="false"></star-rating>
                </div>
                <div class="customerReviews">
                  {{ item.reviews }} Customer reviews
                  <MoneyLevel :level="item.cost" />
                </div>
              </div>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
  </div>


</template>

<script>

import { fireStore } from '@/main.js'
import { firebaseAuth } from "@/main.js"
import StarRating from "vue-star-rating";
import MoneyLevel from "../components/MoneyLevel.vue";
import ImageSlider from "../components/ImageSlider.vue";



export default {
  components: {
    ImageSlider,
    StarRating,
    MoneyLevel,
  },
  data() {
    return {
      model: []
    }
  },
  methods: {
    shuffle() { },
    removeCard(item){
      
      fireStore.collection("TasteBudUsers").doc(firebaseAuth.currentUser.uid)
              .get()
              .then((doc) => {
                var data =  doc.data(); 
        
                data.likedCards = data.likedCards.filter(c=>c.id !== item.id) 
                this.model = data.likedCards;
                 fireStore.collection("TasteBudUsers")
                          .doc(firebaseAuth.currentUser.uid)
                          .set(data)
                          .then()
                          .catch((err)=>{
                              console.log("inner Catch",err, data );
                          });  
                })
                .catch((err)=>{
                       console.log("outer catch",err)
                }); 
    },
    onApplyClick() {
      // Locate the card elements
      let cards = document.querySelectorAll('.resturant__card')
      // Locate the search input
      let search_query = document.getElementById("searchbox").value;
      // Loop through the cards
      for (var i = 0; i < cards.length; i++) {
        // If the text is within the card...
        if (cards[i].innerText.toLowerCase()
          // ...and the text matches the search query...
          .includes(search_query.toLowerCase())) { 
          cards[i].scrollIntoView();
        } 
      }
    }
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        fireStore.collection("TasteBudUsers")
          .doc(firebaseAuth.currentUser.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              this.model = doc.data().likedCards;
              console.log()
            }
          });
        console.log(this.model[0])

      },

      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )

  }
}


</script>

<style scoped>
.card-header {
  background: rgb(235, 226, 226);
}

.list-item {
  display: block;
  margin-top: 5px;
  width: 100%;
  min-height: 525px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  padding: 5px;
}

.btn-top {
  float: right;
  width: 100%;
  align-content: right;
}

.name {
  font-weight: bold;
}

ul {
  padding: 5px;
  margin-bottom: 25%;
  margin-top: 20px;
}

.searchbar {
  position: fixed;
  z-index: 500;
  top: 20px;
  right: 50%;
  width: 90%;
  transform: translate(50%, -50%);
}
.trash {
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 3px;
    padding: 5px;
    background-color:#f5f5f573;

}
</style>