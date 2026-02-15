import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import GuildSettingsPage from "@/pages/GuildSettingsPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: HomePage },
        { path: "/dashboard", component: DashboardPage },
        { path: "/dashboard/guilds/:id", component: GuildSettingsPage, props: true },
        { path: "/:pathMatch(.*)*", component: NotFoundPage },
    ],
});