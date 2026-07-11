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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const all = readAll();
    const hasContent = ((_a = customization.iconUrl) === null || _a === void 0 ? void 0 : _a.trim())
        || ((_b = customization.displayName) === null || _b === void 0 ? void 0 : _b.trim())
        || ((_c = customization.info) === null || _c === void 0 ? void 0 : _c.trim())
        || ((_d = customization.bootApiUrl) === null || _d === void 0 ? void 0 : _d.trim())
        || ((_e = customization.shutdownApiUrl) === null || _e === void 0 ? void 0 : _e.trim())
        || ((_f = customization.statusApiUrl) === null || _f === void 0 ? void 0 : _f.trim())
        || ((_g = customization.f7ApiUrl) === null || _g === void 0 ? void 0 : _g.trim());
    if (hasContent) {
        all[String(hostId)] = {
            iconUrl: ((_h = customization.iconUrl) === null || _h === void 0 ? void 0 : _h.trim()) || undefined,
            displayName: ((_j = customization.displayName) === null || _j === void 0 ? void 0 : _j.trim()) || undefined,
            info: ((_k = customization.info) === null || _k === void 0 ? void 0 : _k.trim()) || undefined,
            bootApiUrl: ((_l = customization.bootApiUrl) === null || _l === void 0 ? void 0 : _l.trim()) || undefined,
            shutdownApiUrl: ((_m = customization.shutdownApiUrl) === null || _m === void 0 ? void 0 : _m.trim()) || undefined,
            statusApiUrl: ((_o = customization.statusApiUrl) === null || _o === void 0 ? void 0 : _o.trim()) || undefined,
            f7ApiUrl: (customization.f7ApiUrl && customization.f7ApiUrl.trim()) || undefined,
        };
    }
    else {
        delete all[String(hostId)];
    }
    writeAll(all);
}

