<template>
  <div style="height: 100%">
    <a class="prev" @click="prev" href="javascript:;">&#10094;</a>
    <a class="next" @click="next" href="javascript:;">&#10095;</a>
    <div
      style="height: 100%; text-align: center"
      v-for="i in [currentIndex]"
      :key="i"
    >
      <img class="imgBox" :src="currentImg.url" />
    </div>
  </div>
</template>
<script>
export default {
  name: "ImageSlider",
  props: ["images"],
  data() {
    return {
      debugPhotos: [
        {url:"img/sample/1.jpg"},
        {url:"img/sample/2.jpg"},
        {url:"img/sample/3.jpg"},
        {url:"img/sample/4.jpg"},
      ],
      currentIndex: 0,
    };
  },
  methods: {
    next: function () {
      this.currentIndex += 1;
    },
    prev: function () {
      this.currentIndex -= 1;
    },
  },
  computed: {
    currentImg: function () {
      var img = {};
      var images = {}; 
      //For testing lets use the debugPhotos 
      if (process.env.NODE_ENV !== "production") {
        images = this.debugPhotos; 
      }else {
        //in production use photos from google
        images = this.images; 
      }
      
      if (images) {
        img = images[Math.abs(this.currentIndex) % images.length];
      } else {
        img.url = "img/no-image.png";
      }
      return img;
    },
  },
};
</script>

<style scoped>
/* img {
    height: 100%;
} */

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 20%;
  width: auto;
  padding-top: 0px;
  padding-left: 16px;
  padding-bottom: 16px;
  padding-right: 16px;
  color: white;
  font-weight: bold;
  font-size: 60px;
  transition: 0.7s ease;
  border-radius: 0 4px 4px 0;
  text-decoration: none;
  user-select: none;
  z-index: 1000002 !important;
  height: 85px;
  vertical-align: middle;
  text-align: center;
  align-content: center;
}
.imgBox {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* Position the "next button" to the right */
.next {
  right: 0;
}

.prev {
  left: 0;
}
</style>
