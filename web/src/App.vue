<!--html-->
<template>
  <NavBar />
  <router-view></router-view>
</template>

<!--js-->
<script>
//access to jquery library
import NavBar from "./components/NavBar.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
export default {
  components: {
    NavBar,
  },
};
</script>

<!-- css -->
<style>
body {
  /* @ -> default src folder*/
  background-image: url("@/assets/images/nini.jpeg");
  background-size: cover;
}
</style>
