// src/app/router.js

import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/features/auth/useAuth.js";

// 静的インポート（常に必要なページのみ）
import HomePage from "@/pages/HomePage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";

// 認証が必要なルートのメタ情報
const requiresAuth = { requiresAuth: true };

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        // 公開ページ（静的インポート）
        { path: "/", component: HomePage },

        // 公開ページ（遅延ローディング）
        {
            path: "/features",
            component: () => import("@/pages/FeaturesPage.vue"),
        },
        {
            path: "/terms",
            component: () => import("@/pages/TermsPage.vue"),
        },
        {
            path: "/refund",
            component: () => import("@/pages/RefundPolicyPage.vue"),
        },
        {
            path: "/privacy",
            component: () => import("@/pages/PrivacyPolicyPage.vue"),
        },
        {
            path: "/premium",
            component: () => import("@/pages/PremiumDetailsPage.vue"),
        },

        // 認証が必要なページ（遅延ローディング）
        {
            path: "/dashboard",
            component: () => import("@/pages/DashboardPage.vue"),
            meta: requiresAuth,
        },
        {
            path: "/dashboard/premium",
            component: () => import("@/pages/PremiumPage.vue"),
            meta: requiresAuth,
        },
        {
            path: "/dashboard/guilds/:id",
            component: () => import("@/pages/GuildSettingsPage.vue"),
            props: true,
            meta: requiresAuth,
        },

        // 404ページ
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

// ナビゲーションガード
router.beforeEach(async (to, from, next) => {
    // 認証が必要なルートかチェック
    if (to.meta.requiresAuth) {
        const { isLoggedIn, refreshMe, isLoading } = useAuth();

        // まだ認証状態を確認していない場合は確認する
        if (!isLoggedIn.value && !isLoading.value) {
            try {
                await refreshMe();
            } catch (error) {
                console.error("Auth check failed:", error);
            }
        }

        // 認証されていない場合はホームページにリダイレクト
        if (!isLoggedIn.value) {
            // リダイレクト先を保存
            sessionStorage.setItem("redirectAfterLogin", to.fullPath);

            next({
                path: "/",
                query: { redirect: to.fullPath },
            });
            return;
        }
    }

    next();
});

// ログイン後のリダイレクト処理
export function handlePostLoginRedirect() {
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
    } else {
        router.push("/dashboard");
    }
}
