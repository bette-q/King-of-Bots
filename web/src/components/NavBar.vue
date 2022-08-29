<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }"
        >King of Bots</router-link
      >
      <div class="collapse navbar-collapse" id="navbarText">
        <!--header menu-->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :class="routeName == 'main_page' ? 'nav-link active' : 'nav-link'"
              :to="{ name: 'main_page' }"
              >Play Game</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="routeName == 'in_game' ? 'nav-link active' : 'nav-link'"
              :to="{ name: 'in_game' }"
              >In-Game Players</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="
                routeName == 'leaderboard' ? 'nav-link active' : 'nav-link'
              "
              :to="{ name: 'leaderboard' }"
              >Leaderboard</router-link
            >
          </li>
        </ul>

        <!--drop down menu-->
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="@/assets/images/face0.png"
                alt=""
                width="30"
                height="24"
                class="d-inline-block align-text-top"
              />
              greenfishroll
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'user_bots' }"
                  >My Bots</router-link
                >
              </li>
              <li><hr class="dropdown-divier" /></li>
              <li><a class="dropdown-item" href="#">Exit</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  //retrieves current page link
  setup() {
    const route = useRoute();
    let routeName = computed(() => route.name);
    return {
      routeName,
    };
  },
};
</script>

<style scoped></style>
