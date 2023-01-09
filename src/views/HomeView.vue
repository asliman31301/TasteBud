<template>
  <div class="home">
    <CardDeck ref="cardDeck" v-if="locationLoaded" :places="this.places" @onNoMoreCard="onNoMoreCard"></CardDeck>
  </div>
</template>

<script>
//using esling-disable to get around over zealous linter rules
/* eslint-disable */
import CardDeck from "@/components/CardDeck.vue";
import debugPlaces from "@/places"; //This is only used for debug reasons it just contains a cache dump from google
import { fireStore } from "@/main";
import { firebaseAuth } from "@/main.js";
import { CurvedBottomNavigation } from "bottom-navigation-vue";

export default {
  name: "HomeView",
  components: {
    CardDeck, // only using the CardDeck compoent
    CurvedBottomNavigation
  },
  //Private variable to this comppnent
  data: () => ({
    lat: 0,
    lng: 0,
    type: "restaurant",
    radius: 5,
    places: [],
    showDismissibleAlert: false,
    selected: true,
    locationLoaded: false,
  }),
  mounted() {
    this.fetchPlaceData();
    console.log('mounted');
  },
  created() {

    window.addEventListener("online", () => {
      this.showDismissibleAlert = false;
    });
    window.addEventListener("offline", () => {
      this.showDismissibleAlert = true;
    });

     this.$watch(
      () => this.$route.params,
      () => {
        this.places = [];
        this.$refs.cardDeck.radarConfirm();
        this.locationLoaded = false;
        this.fetchPlaceData();
        
        this.$refs.cardDeck.updateResturants(); 
        
        console.log( CurvedBottomNavigation); 
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  methods: {
    onNoMoreCard() {
      this.locationLoaded = false;
      this.fetchPlaceData();
    },
    populatePlaces(doc,lat, lng) {
      var alts = [];
      var rad = 0;
      if(doc.data().filters.manualSearch !== "") {
        alts = [doc.data().filters.manualSearch];
      } else {
        alts = doc.data().filters.selectedImages.map((x) => x.alt);
        alts.join(", "); 
      }
      //alts = doc.data().filters.selectedImages.map((x) => x.alt);
      if(doc.data().filters.distance == 0){
        rad = 500;
      } else {
        rad = doc.data().filters.distance;
        rad = rad * 1609.344;
      }  
      console.log(doc.data().filters.manualLocation)
      var request = {
        location: new google.maps.LatLng(lat, lng),
        type: 'restaurant',
        keyword: alts,
        radius: rad,
      };
      window.googleService = new google.maps.places.PlacesService(
        map
      );
      window.googleService.nearbySearch(
        request,
        (placesResults, status, pagenation) => {
          this.places = placesResults;
          this.locationLoaded = true;
        }
      );
    },
    fetchPlaceData() {
      if (process.env.NODE_ENV !== "production") {
        if (!this.locationLoaded) {
          this.places = debugPlaces.results;
          this.locationLoaded = true;
        }
      } else {
        navigator.geolocation.getCurrentPosition(
          (e) => {
            this.lat = e.coords.latitude;
            this.lng = e.coords.longitude;

            let map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: this.lat, lng: this.lng },
              zoom: 12,
            });


            var ref = fireStore.collection("TasteBudUsers").doc(firebaseAuth.currentUser.uid);
            ref
              .get()
              .then((doc) => {
                if (doc.exists) {
                  //We forgot to call data() 
                  console.log(doc.data())
                  if (doc.data().filters.useLocation == false) {
                    var geocoder = new google.maps.Geocoder();
                    
                    geocoder
                      .geocode({ 'address': doc.data().filters.manualLocation })
                      .then((result) => {
                        const { results } = result;
                        console.log("This is results:" + results[0].geometry.location)
                        this.populatePlaces(doc, results[0].geometry.location)
                        return results[0];
                      })
                      .catch((e) => {
                        alert("Geocode was not successful for the following reason: " + e);
                      });
                  } else {
                      //Get location from device
                      //send lat and lon to populatePlaces
                      this.populatePlaces(doc, this.lat, this.lng) 
                  }
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
              });

            //"fast food, seafood, steak, burgers, bbq, Asian"
          },
          (e) => {
            //Prompt user for location if they deny it
            console.log(e);
          }
        );
      }
    },
    
  },
};
</script>
