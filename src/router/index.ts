import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: {
      name: "chats",
    },
  },
  {
    path: "/operation",
    name: "operation",
    component: () => import("@/views/OperationView.vue"),
  },
  {
    path: "/chats",
    name: "chats",
    component: () => import("@/views/Chats.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
