<template>
  <div>
    <div class="radar">
      <div class="pointer"></div>
      <div class="shadow"></div>
    </div>
    <div class="radar-msg">
      We've run out of matches, go to settings and change your filters!
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style>
.radar {
  /* background: url("../assets/radar.png") no-repeat 50% 50%; */
  width: 284px;
  height: 284px;
  position: relative;
  background-size: 284px 284px;
  position: absolute;
  left: 50%;
  top: 30%;
  margin-left: -142px;
  margin-top: -142px;
}
.radar-msg {
  position: absolute;
  color: black;
  top: 65%;
  font-size: large;
  top: 50%;
  left: 50%;
  
  transform: translate(-50%, 0%);
  max-width: 100%;
  max-height: 100%;
  z-index: 10;
}

.radar:hover {
  background: none;
}

.radar .pointer {
  position: absolute;
  z-index: 1024;
  left: 10.5820106%;
  right: 10.5820106%;
  top: 10.5820106%;
  bottom: 50%;
  will-change: transform;
  transform-origin: 50% 100%;
  border-radius: 50% 50% 0 0/100% 100% 0 0;
  background-image: linear-gradient(
    135deg,
    rgba(91, 60, 68, 0.8) 0%,
    rgba(0, 0, 0, 0.02) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-clip-path: polygon(100% 0, 100% 10%, 50% 100%, 0 100%, 0 0);
  clip-path: polygon(100% 0, 100% 10%, 50% 100%, 0 100%, 0 0);
  -webkit-animation: rotate360 3s infinite linear;
  animation: rotate360 3s infinite linear;
}

.radar .pointer:after {
  content: "";
  position: absolute;
  width: 50%;
  bottom: -1px;
  border-top: 2px solid rgba(0, 60, 68, 0.8);
  box-shadow: 0 0 3px rgba(0, 60, 68, 0.6);
  border-radius: 9px;
}

.shadow {
  position: absolute;
  left: 11%;
  top: 11%;
  right: 11%;
  bottom: 11%;
  margin: auto;
  border-radius: 9999px;
  box-shadow: 0 0 66px 6px #a51414;
  -webkit-animation: shadow 1s infinite ease;
  animation: shadow 1s infinite ease;
}

@-webkit-keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
@-webkit-keyframes shadow {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes shadow {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>