// src/lib/config.js

/**
 * アプリケーション設定
 * 環境変数から読み込み、デフォルト値を提供
 */
export const config = {
    // Discord OAuth2 Client ID
    discordClientId: import.meta.env.VITE_DISCORD_CLIENT_ID || "",

    // Discord Bot招待用パーミッション
    discordBotPermissions: import.meta.env.VITE_DISCORD_BOT_PERMISSIONS || "3145728",

    // API Base URL（必要に応じて）
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",

    // 開発モードかどうか
    isDev: import.meta.env.DEV,

    // プロダクションモードかどうか
    isProd: import.meta.env.PROD,
};

/**
 * Discord Bot招待URLを生成
 * @param {string} guildId - ギルドID
 * @param {boolean} disableGuildSelect - ギルド選択を無効にするか
 * @returns {string}
 */
export function getDiscordInviteUrl(guildId = "", disableGuildSelect = false) {
    if (!config.discordClientId) {
        console.warn("Discord Client ID is not configured");
        return "#";
    }

    const params = new URLSearchParams({
        client_id: config.discordClientId,
        permissions: config.discordBotPermissions,
        scope: "bot applications.commands",
    });

    if (guildId) {
        params.set("guild_id", guildId);
    }

    if (disableGuildSelect) {
        params.set("disable_guild_select", "true");
    }

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

/**
 * Discord OAuth2ログインURLを生成
 * @returns {string}
 */
export function getDiscordLoginUrl() {
    if (!config.discordClientId) {
        console.warn("Discord Client ID is not configured");
        return "#";
    }

    // 実際のOAuth2フローはバックエンドで処理されるため、
    // これはバックエンドのエンドポイントを指す
    return "/auth/discord";
}
