import { createRouter, createWebHistory } from "vue-router";
import MainPageView from "@/views/pk/MainPageView";
import InGameListView from "@/views/inGame/InGameListView";
import LeaderboardView from "@/views/leaderboard/LeaderboardView";
import UserBotsView from "@/views/user/bots/UserBotView";
import NotFound from "@/views/error/NotFound";

//configures url to component
const routes = [
  {
    //default -> main page
    path: "/",
    name: "home",
    redirect: "/pk/",
  },
  {
    path: "/pk/",
    name: "main_page",
    component: MainPageView,
  },
  {
    path: "/ingame/",
    name: "in_game",
    component: InGameListView,
  },
  {
    path: "/leaderboard/",
    name: "leaderboard",
    component: LeaderboardView,
  },
  {
    path: "/user/bots/",
    name: "user_bots",
    component: UserBotsView,
  },
  {
    path: "/404/",
    name: "404",
    component: NotFound,
  },
  {
    //catch nonexistent url
    path: "/:catchAll(.*)",
    redirect: "/404/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
