const STORAGE_KEY = "mlDeviceCustomizations";
function readAll() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return {};
        }
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            return parsed;
        }
    }
    catch (_err) { }
    return {};
}
function writeAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export function getDeviceCustomization(hostId) {
    var _a;
    return (_a = readAll()[String(hostId)]) !== null && _a !== void 0 ? _a : {};
}
export function setDeviceCustomization(hostId, customization) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const all = readAll();
    const hasContent = ((_a = customization.iconUrl) === null || _a === void 0 ? void 0 : _a.trim())
        || ((_b = customization.displayName) === null || _b === void 0 ? void 0 : _b.trim())
        || ((_c = customization.info) === null || _c === void 0 ? void 0 : _c.trim())
        || ((_d = customization.bootApiUrl) === null || _d === void 0 ? void 0 : _d.trim());
    if (hasContent) {
        all[String(hostId)] = {
            iconUrl: ((_e = customization.iconUrl) === null || _e === void 0 ? void 0 : _e.trim()) || undefined,
            displayName: ((_f = customization.displayName) === null || _f === void 0 ? void 0 : _f.trim()) || undefined,
            info: ((_g = customization.info) === null || _g === void 0 ? void 0 : _g.trim()) || undefined,
            bootApiUrl: ((_h = customization.bootApiUrl) === null || _h === void 0 ? void 0 : _h.trim()) || undefined,
        };
    }
    else {
        delete all[String(hostId)];
    }
    writeAll(all);
}

