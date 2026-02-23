import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import PremiumPage from "@/pages/PremiumPage.vue";
import PremiumDetailsPage from "@/pages/PremiumDetailsPage.vue";
import FeaturesPage from "@/pages/FeaturesPage.vue";
import GuildSettingsPage from "@/pages/GuildSettingsPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import TermsPage from "@/pages/TermsPage.vue";
import RefundPolicyPage from "@/pages/RefundPolicyPage.vue";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: HomePage },
        { path: "/features", component: FeaturesPage },
        { path: "/terms", component: TermsPage },
        { path: "/refund", component: RefundPolicyPage },
        { path: "/privacy", component: PrivacyPolicyPage },
        { path: "/dashboard", component: DashboardPage },
        { path: "/dashboard/premium", component: PremiumPage },
        { path: "/premium", component: PremiumDetailsPage },
        { path: "/dashboard/guilds/:id", component: GuildSettingsPage, props: true },
        { path: "/:pathMatch(.*)*", component: NotFoundPage },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});
