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
