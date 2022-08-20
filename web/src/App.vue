<!--html-->
<template>
  <div>
    <div>Bot Name: {{ botName }}</div>
    <div>Bot Elo: {{ botElo }}</div>
  </div>
  <router-view></router-view>
</template>

<!--js-->
<script>
import $ from "jquery";
import { ref } from "vue";
export default {
  name: "App",
  setup: () => {
    let botName = ref("");
    let botElo = ref("");

    $.ajax({
      url: "http://localhost:3000/pk/getbotinfo/",
      type: "get",
      success: (resp) => {
        botName.value = resp.name;
        botElo.value = resp.age;
      },
    });
    return {
      botName,
      botElo,
    };
  },
};
</script>

<!-- css -->
<style>
body {
  background-image: url("@/assets/nini.jpeg");
  background-size: cover;
}
</style>
