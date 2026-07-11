export function applyAppearanceSettings(settings) {
    var _a;
    const url = (_a = settings.backgroundImageUrl) === null || _a === void 0 ? void 0 : _a.trim();
    if (url) {
        document.documentElement.style.setProperty("--ml-bg-image", `url("${url}")`);
        document.body.classList.add("has-bg-image");
    }
    else {
        document.documentElement.style.removeProperty("--ml-bg-image");
        document.body.classList.remove("has-bg-image");
    }
}

// ─── HÄR INJEKTERAR VI DINA CUSTOM EDITS DYNAMISKT ───────────────────
document.addEventListener("DOMContentLoaded", () => {
    // 1. Skapa en MutationObserver som väntar på att Moonlight har byggt menyn
    const observer = new MutationObserver((mutations, obs) => {
        const titleElement = document.querySelector(".top-line h1");
        
        if (titleElement) {
            // Ändra rubriken till din anpassade domänlänk
            titleElement.innerHTML = '<a href="https://pc.lordn.eu" class="title-home-link">pc.lordn<span class="eu-title-suffix">.eu</span> <span class="app-title-separator">|</span> Moonlight</a>';
            
            // Lägg till dina custom titlar (tooltips) på knapparna om de existerar
            const logoutBtn = document.querySelector(".logout-button");
            if (logoutBtn) logoutBtn.title = "Sign Out";

            const loginBtn = document.querySelector(".login-button");
            if (loginBtn) loginBtn.title = "Sign In";

            const adminBtn = document.querySelector(".admin-button");
            if (adminBtn) adminBtn.title = "Admin";

            const hostAddBtn = document.querySelector(".host-add");
            if (hostAddBtn) hostAddBtn.title = "Add Device";

            const settingsBtn = document.querySelector(".open-settings");
            if (settingsBtn) settingsBtn.title = "Settings";

            // Vi hittade det vi sökte, stäng av observern så den inte drar prestanda
            obs.disconnect();
        }
    });

    // Starta bevakningen av HTML-strukturen
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});