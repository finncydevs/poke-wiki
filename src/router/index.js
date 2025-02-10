import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Home.vue";
import Details from "@/views/Details.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/pokemon/:id",
      name: "Details",
      component: Details,
    },
  ],
});

export default router;
