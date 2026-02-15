import { createApp } from "vue";
import AppRoot from "@/app/AppRoot.vue";
import { router } from "@/app/router.js";

import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/layout.css";

createApp(AppRoot).use(router).mount("#app");