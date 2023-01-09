<template>
  <main>
    <Tinder
      ref="card"
      key-name="id"
      :queue.sync="queue"
      :offset-y="10"
      @submit="onSubmit"
    >
      <template slot-scope="scope">
        <div class="resturant__card">
          <div style="height: 100%">
            <ImageSlider :images="scope.data.photos" />
            <!-- <div class="resturant__card__btm"> -->

            <div class="resturantInfo">
              <div class="resturant__card__we">{{ scope.data.name }}</div>

              <div>
                <i class="fas fa-map-marker-alt"></i>
                <a
                  class="mapLink"
                  :href="`https://www.google.com/maps/search/?api=1&query=${scope.data.vicinity}`"
                  >{{ scope.data.vicinity }}</a
                >
              </div>
              <div class="phoneNumber">
                <a class="phoneLink" :href="'tel:+1' + scope.data.phoneNumber">{{
                  scope.data.phoneNumber
                }}</a>
              </div>
              <div class="hoursOfoperation">
                {{scope.data.hoursOfoperation}}
              </div>
              <div>
                {{ scope.data.rating }}&nbsp;&nbsp;
                <star-rating
                  :inline="true"
                  :rating="scope.data.rating"
                  :read-only="true"
                  :increment="0.01"
                  :star-size="20"
                  :showRating="false"
                ></star-rating>
              </div>
              <div class="customerReviews">
                {{ scope.data.reviews }} Customer reviews
                <MoneyLevel :level="scope.data.cost" />
              </div>
            </div>
          </div>
          <div class="resturant__card__choice m--reject"></div>
          <div class="resturant__card__choice m--like"></div>
          <div class="resturant__card__drag"></div>
        </div>
      </template>

      <img class="like-pointer" slot="like" src="@/assets/like-txt.png" />
      <img class="nope-pointer" slot="nope" src="@/assets/nope-txt.png" />
    </Tinder>
    <RadarAnimation v-if="showRadar" />
    <div class="btns">
      <img src="@/assets/nope.png" @click="decide('nope')" />
      <img src="@/assets/rewind.png" @click="decide('rewind')" />
      <img src="@/assets/like.png" @click="decide('like')" />
    </div>
  </main>
</template>
<script>
/* eslint-disable */
import Tinder from "vue-tinder";
import StarRating from "vue-star-rating";
import MoneyLevel from "./MoneyLevel.vue";
import RadarAnimation from "./RadarAnimation.vue";
import ImageSlider from "./ImageSlider.vue";
import debugPlacesDetails from "@/placeDetails";
  
import { Route } from 'vue-router';
import {fireStore} from '@/main.js'
import { firebaseAuth } from "@/main.js";
var cards;
export default {
  name: "CardDeck",
  components: {
    Tinder,
    StarRating,
    MoneyLevel,
    RadarAnimation,
    ImageSlider,
    ImageSlider,
  },
  props: ["places"],
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
    resturants: [],
    showRadar: false,
    test: "",
    model:{likedCards:[]}
  }),
  created() {},
  mounted() {
    this.resturants = this.places;
    console.log(this.resturants);
    this.getCards(3, true);
  },
  methods: {
    getDayOfWeek(){
      const d = new Date();
      let day = d.getDay();
      if(day > 0) {
        day = day - 1;
        
      } else {        
        day = day + 6;
        
      }
      return day;
    },
    radarConfirm(){
      this.showRadar = true;
    },
    updateResturants(newPlaces){  
      debugger
      this.resturants = newPlaces; 
      this.queue = []; 
      this.getCards(); 
    },
    getCards(count = 5, append = true) {
      const list = [];
      let readyForNext = true;
      let index = 0;
      let self = this;
      let timer = setInterval(() => {
        if (readyForNext && index < count) {
          index++;
          readyForNext = false;
          const plc = self.resturants[self.offset];
          if (plc) {
            if (process.env.NODE_ENV !== "production") {
              let placeDetail = debugPlacesDetails.results.find(
                (detail) => detail.place_id === plc.place_id
              );

              if (placeDetail) {
                list.push({
                  id: plc.place_id,
                  name: plc.name,
                  vicinity: placeDetail.formatted_address,
                  reviews: plc.user_ratings_total,
                  rating: plc.rating,
                  cost: plc.price_level,
                  photos: placeDetail.photos,
                  phoneNumber: placeDetail.formatted_phone_number,
                });
              }
              self.offset++;
              readyForNext = true;
            } else {
              var detailRequest = {
                placeId: plc.place_id,
                fields: [
                  "photos",
                  "formatted_phone_number",
                  "formatted_address",
                  "opening_hours"
                ],
              };
              window.googleService.getDetails(detailRequest, (detailResult) => {
                if (detailResult.photos) {
                  detailResult.photos.forEach((p, i) => {
                    detailResult.photos[i].url = p.getUrl();
                  });
                }
                
                list.push({
                  id: plc.place_id,
                  name: plc.name,
                  vicinity: detailResult.formatted_address,
                  reviews: plc.user_ratings_total,
                  rating: plc.rating,
                  cost: plc.price_level,
                  photos: detailResult.photos,
                  phoneNumber: detailResult.formatted_phone_number,
                  hoursOfoperation: detailResult.opening_hours
                                                .weekday_text[this.getDayOfWeek()]
                });
                self.offset++;
                readyForNext = true;
              });
            }
          }
        }
        if (index == count - 1) {
          if (append) this.queue = this.queue.concat(list);
          else this.queue.unshift(...list);
          this.showRadar = false;
          clearInterval(timer);
        }
      }, 300);
    },
    onSubmit(submittedItem ) {
      if (this.queue.length < 3) {
        this.getCards(5, true);
      }
      console.log(this.resturants)
      console.log(this.history.length)
      this.history.push(submittedItem.item);
      // cards = fireStore.collection("userCards")
      // cards.add(item);
      
      if(submittedItem.type == 'like') {
        console.log(submittedItem);
      this.model.likedCards.push(JSON.parse(JSON.stringify(submittedItem.item))); 
      fireStore.collection("TasteBudUsers").doc(firebaseAuth.currentUser.uid)
              .get()
              .then((doc) => {
                var data =  doc.data(); 
                var newCards = []; 
                this.model.likedCards.forEach(c=>{
                  if(!data.likedCards.find((cc=>cc.id === c.id)))
                     newCards.push(c);
                });
                data.likedCards.push(...newCards);
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
      
      }
      if (this.queue.length === 0) this.showRadar = true;
      else this.showRadar = false;
    },
    async decide(choice) {
          
      if (choice === "rewind") {
        if (this.history.length) {
          console.log(this.history)
          this.$refs.card.rewind([this.history.pop()]);
        }
      } else {
        this.$refs.card.decide(choice);
      }
      if (this.queue.length === 0) {
        this.showRadar = true;
        if (this.offset === this.places.length) {
          this.$emit("onNoMoreCard");
        }
      } else this.showRadar = false;
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#app .vue-tinder {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 5px;
  margin: auto;
  width: calc(100%);
  height: calc(90vh - 75px);
  min-width: 300px;
  max-width: 600px;
  max-height: 900px;
  overflow: hidden;
  /* border: 1px solid black; */
}
/* .phoneNumber {
  font-size: 18px;
  font-weight: bold;
}
.mapLink {
  color: white;
  margin-left: 5px;
  font-size: 18px;
}
.phoneLink{
  color: white;
  font-size: 18px;
}
a.phoneLink,
a.mapLink {
  text-decoration: underline;
}
a.phoneLink:visited,
a.mapLink:visited {
  text-decoration: underline;
  color: white;
} */
.tinderCard {
  width: 100%;
  height: 100%;
}

.tinder-card {
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: 90% !important;
  height: 90% !important;
  max-height: 750px;
  max-width: 400px;
  margin: 0 auto;

  /* border: 1px solid black; */
}

.nope-pointer,
.like-pointer {
  position: absolute;

  top: 20px;
  width: 64px;
  height: 64px;
  z-index: 1000002 !important;
}

.nope-pointer {
  right: 10px;
}

.like-pointer {
  left: 10px;
}

.super-pointer {
  position: absolute;
  z-index: 1;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: auto;
  width: 112px;
  height: 78px;
}

.rewind-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 10px;
  width: 112px;
  height: 78px;
}

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100px;
  margin: auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 355px;
}

.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(2n + 1) {
  width: 53px;
}

.btns img:nth-child(2n) {
  width: 65px;
}

.btns img:nth-last-child(1) {
  margin-right: 0;
}
.resturantInfo {
  position: absolute;
  z-index: 102;
  bottom: 0px;
  color: white;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
}
div.resturantInfo > a {
  text-decoration: none;
}
.resturant__card-cont {
  position: relative;
  width: 24rem;
  height: 32rem;
  margin: 0 auto 5rem;
}

.resturant__card {
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform-origin: 50% 100%;
}

.resturant__card.below {
  z-index: 1;
}

.resturant__card__top {
  height: calc(50%);
}

.resturant__card__btm {
  height: calc(50%);
  padding: 15px;
  background: #ffffff;
}

.resturant__card__top.brown {
  background: #795548;
}

.resturant__card__top.navy {
  background: #50708a;
}

.resturant__card__img {
  overflow: hidden;
  width: 10rem;
  height: 10rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  border: 0.5rem solid #ffffff;
}

.resturant__card__name {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.resturant__card__we {
  font-size: 20px;
  font-weight: bold;
}

.resturant__card__choice {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.resturant__card__choice:before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2rem;
  height: 2rem;
  margin-left: -1rem;
  color: #fff;
  border-radius: 50%;
  box-shadow: -2rem -3rem #fff, 2rem -3rem #fff;
}

.resturant__card__choice:after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4rem;
  height: 1.5rem;
  margin-left: -2rem;
  border: 0.6rem solid #fff;
  border-bottom: none;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}

.resturant__card__choice.m--reject {
  background: #ff945a;
}

.resturant__card__choice.m--like {
  background: #b1da96;
}

.resturant__card__choice.m--like:after {
  transform: scaleY(-1);
}

.resturant__card__drag {
  z-index: 5;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: -webkit-grab;
  cursor: grab;
}

.resturant__tip {
  text-align: center;
  font-size: 2.2rem;
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
  .btns {
    bottom: 65px;
  }
}
</style>
