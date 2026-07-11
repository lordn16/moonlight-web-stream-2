var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiDeleteHost, apiGetHost, isDetailedHost, apiPostPair, apiWakeUp, apiGetUser, apiPatchHost } from "../../api.js";
import { ComponentEvent } from "../index.js";
import { getCurrentLanguage, getTranslations } from "../../i18n.js";
import { setContextMenu } from "../context_menu.js";
import { showNotification } from "../notification.js";
import { showMessage, showModal } from "../modal/index.js";
import { HOST_IMAGE, HOST_OVERLAY_LOCK, HOST_OVERLAY_NONE, HOST_OVERLAY_OFFLINE } from "../../resources/index.js";
import { getDeviceCustomization, setDeviceCustomization } from "./device_customization.js";
import { EditDeviceModal } from "./edit_modal.js";
import { getLocalStreamSettings, globalDefaultSettings } from "../settings_menu.js";
export class Host {
    constructor(api, hostId, host) {
        this.userCache = null;
        this.cache = null;
        this.divElement = document.createElement("div");
        this.imageElement = document.createElement("img");
        this.imageOverlayElement = document.createElement("img");
        this.nameElement = document.createElement("p");
        this.infoElement = document.createElement("p");
        this.btnContainer = document.createElement("div");
        this.btnStart = document.createElement("button");
        this.btnShutdown = document.createElement("button");
        this.api = api;
        this.hostId = hostId;
        this.cache = host;
        // Configure image
        this.imageElement.classList.add("host-image");
        this.imageElement.src = HOST_IMAGE;
        // Configure image overlay
        this.imageOverlayElement.classList.add("host-image-overlay");
        // Configure name
        this.nameElement.classList.add("host-name");
        // Configure info
        this.infoElement.classList.add("host-info-text");
        // Configure buttons container
        this.btnContainer.classList.add("host-actions-container");
        this.btnStart.innerText = getTranslations(getCurrentLanguage()).host.start;
        this.btnStart.classList.add("host-action-btn", "start-btn");
        this.btnStart.addEventListener("click", (e) => {
            e.stopPropagation();
            const settings = getLocalStreamSettings(globalDefaultSettings());
            this.runSecretApi(settings.deviceStartApiUrl);
        });
        this.btnShutdown.innerText = getTranslations(getCurrentLanguage()).host.forceShutdown;
        this.btnShutdown.classList.add("host-action-btn", "shutdown-btn");
        this.btnShutdown.addEventListener("click", (e) => {
            e.stopPropagation();
            const settings = getLocalStreamSettings(globalDefaultSettings());
            this.runSecretApi(settings.deviceForceShutdownApiUrl);
        });
        this.btnBoot = document.createElement("button");
        this.btnBoot.innerText = getTranslations(getCurrentLanguage()).host.boot || "Boot";
        this.btnBoot.classList.add("host-action-btn", "boot-btn");
        this.btnBoot.addEventListener("click", (e) => {
            e.stopPropagation();
            const customization = getDeviceCustomization(this.hostId);
            this.runSecretApi(customization.bootApiUrl);
        });
        this.btnContainer.appendChild(this.btnStart);
        this.btnContainer.appendChild(this.btnShutdown);
        this.btnContainer.appendChild(this.btnBoot);
        // Append elements
        this.divElement.appendChild(this.imageElement);
        this.divElement.appendChild(this.imageOverlayElement);
        this.divElement.appendChild(this.nameElement);
        this.divElement.appendChild(this.infoElement);
        this.divElement.appendChild(this.btnContainer);
        this.divElement.addEventListener("click", this.onClick.bind(this));
        this.divElement.addEventListener("contextmenu", this.onContextMenu.bind(this));
        // Update cache
        if (host != null) {
            this.updateCache(host, null);
            apiGetUser(api).then((user) => this.userCache = user);
        }
        else {
            this.forceFetch();
        }
    }
    forceFetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const [newCache, user] = yield Promise.all([
                apiGetHost(this.api, {
                    host_id: this.hostId,
                }),
                apiGetUser(this.api)
            ]);
            this.updateCache(newCache, user);
        });
    }
    getCurrentGame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.forceFetch();
            if (this.cache && isDetailedHost(this.cache) && this.cache.current_game != 0) {
                return this.cache.current_game;
            }
            else {
                return null;
            }
        });
    }
    onClick(event) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (((_a = this.cache) === null || _a === void 0 ? void 0 : _a.server_state) == null) {
                this.onContextMenu(event);
            }
            else if (((_b = this.cache) === null || _b === void 0 ? void 0 : _b.paired) == "Paired") {
                this.divElement.dispatchEvent(new ComponentEvent("ml-hostopen", this));
            }
            else {
                yield this.pair();
            }
        });
    }
    onContextMenu(event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const i = getTranslations(getCurrentLanguage()).host;
        const elements = [];
        if (((_a = this.cache) === null || _a === void 0 ? void 0 : _a.server_state) != null) {
            elements.push({
                name: i.showDetails,
                callback: this.showDetails.bind(this),
            });
            elements.push({
                name: i.open,
                callback: this.onClick.bind(this)
            });
        }
        else if (((_b = this.cache) === null || _b === void 0 ? void 0 : _b.paired) == "Paired") {
            elements.push({
                name: i.sendWakeUpPacket,
                callback: this.wakeUp.bind(this)
            });
        }
        elements.push({
            name: i.reload,
            callback: () => __awaiter(this, void 0, void 0, function* () { return this.forceFetch(); })
        });
        elements.push({
            name: i.editDevice,
            callback: this.editDevice.bind(this)
        });
        if (((_c = this.cache) === null || _c === void 0 ? void 0 : _c.server_state) != null && ((_d = this.cache) === null || _d === void 0 ? void 0 : _d.paired) == "NotPaired") {
            elements.push({
                name: i.pair,
                callback: this.pair.bind(this)
            });
        }
        // Make private / global
        if (((_e = this.userCache) === null || _e === void 0 ? void 0 : _e.role) == "Admin") {
            if (((_f = this.cache) === null || _f === void 0 ? void 0 : _f.owner) == "Global") {
                elements.push({
                    name: i.makePrivate,
                    callback: this.makePrivate.bind(this),
                    classes: ["context-menu-element-red"]
                });
            }
            else if (((_g = this.cache) === null || _g === void 0 ? void 0 : _g.owner) == "ThisUser") {
                elements.push({
                    name: i.makeGlobal,
                    callback: this.makeGlobal.bind(this),
                    classes: ["context-menu-element-red"]
                });
            }
        }
        if (((_h = this.cache) === null || _h === void 0 ? void 0 : _h.owner) == "ThisUser" || ((_j = this.userCache) === null || _j === void 0 ? void 0 : _j.role) == "Admin") {
            elements.push({
                name: i.removeHost,
                callback: this.remove.bind(this)
            });
        }
        setContextMenu(event, {
            elements
        });
    }
    showDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const i = getTranslations(getCurrentLanguage()).host;
            let host = this.cache;
            if (!host || !isDetailedHost(host)) {
                host = yield apiGetHost(this.api, {
                    host_id: this.hostId,
                });
            }
            if (!host || !isDetailedHost(host)) {
                showNotification(i.failedToGetDetails(this.hostId));
                return;
            }
            this.updateCache(host, this.userCache);
            yield showMessage(i.details(host));
        });
    }
    editDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            const customization = getDeviceCustomization(this.hostId);
            const modal = new EditDeviceModal(customization);
            const result = yield showModal(modal);
            if (result !== null) {
                setDeviceCustomization(this.hostId, result);
                this.forceFetch();
            }
        });
    }
    runSecretApi(urlTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!urlTemplate)
                return;
            const hostName = ((_a = this.cache) === null || _a === void 0 ? void 0 : _a.name) || "";
            const url = urlTemplate
                .replace(/{host_id}/g, String(this.hostId))
                .replace(/{name}/g, encodeURIComponent(hostName));
            try {
                const res = yield fetch(url);
                const text = yield res.text();
                let parsed;
                try {
                    parsed = JSON.parse(text);
                }
                catch (_b) {
                    parsed = text;
                }
                showNotification(`API Response: ${typeof parsed === "object" ? JSON.stringify(parsed) : parsed}`, "info");
            }
            catch (err) {
                showNotification(`API Error: ${err.message || err}`, "error");
            }
        });
    }
    addHostRemoveListener(listener, options) {
        this.divElement.addEventListener("ml-hostremove", listener, options);
    }
    removeHostRemoveListener(listener, options) {
        this.divElement.removeEventListener("ml-hostremove", listener, options);
    }
    addHostOpenListener(listener, options) {
        this.divElement.addEventListener("ml-hostopen", listener, options);
    }
    removeHostOpenListener(listener, options) {
        this.divElement.removeEventListener("ml-hostopen", listener, options);
    }
    makeGlobal() {
        return __awaiter(this, void 0, void 0, function* () {
            yield apiPatchHost(this.api, {
                host_id: this.hostId,
                change_owner: true,
                owner: null,
            });
            if (this.cache) {
                this.cache.owner = "Global";
            }
        });
    }
    makePrivate() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = (_a = this.userCache) !== null && _a !== void 0 ? _a : yield apiGetUser(this.api);
            yield apiPatchHost(this.api, {
                host_id: this.hostId,
                change_owner: true,
                owner: user.id,
            });
            if (this.cache) {
                this.cache.owner = "ThisUser";
            }
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield apiDeleteHost(this.api, {
                host_id: this.getHostId()
            });
            this.divElement.dispatchEvent(new ComponentEvent("ml-hostremove", this));
        });
    }
    wakeUp() {
        return __awaiter(this, void 0, void 0, function* () {
            const i = getTranslations(getCurrentLanguage()).host;
            yield apiWakeUp(this.api, {
                host_id: this.getHostId()
            });
            yield showMessage(i.wakeUpSent);
        });
    }
    pair() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            var _d;
            const i = getTranslations(getCurrentLanguage()).host;
            if (((_a = this.cache) === null || _a === void 0 ? void 0 : _a.paired) == "Paired") {
                yield this.forceFetch();
                if (((_b = this.cache) === null || _b === void 0 ? void 0 : _b.paired) == "Paired") {
                    showMessage(i.alreadyPaired);
                    return;
                }
            }
            const responseStream = yield apiPostPair(this.api, {
                host_id: this.getHostId()
            });
            if (typeof responseStream.response == "string") {
                throw `failed to pair (stage 1): ${responseStream.response}`;
            }
            const messageAbort = new AbortController();
            showMessage(i.pairPrompt((_d = (_c = this.getCache()) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "", responseStream.response.Pin), { signal: messageAbort.signal });
            const resultResponse = yield responseStream.next();
            messageAbort.abort();
            if (!resultResponse) {
                throw "missing stage 2 of pairing";
            }
            else if (typeof resultResponse == "string") {
                throw `failed to pair (stage 2): ${resultResponse}`;
            }
            this.updateCache(resultResponse.Paired, null);
        });
    }
    getHostId() {
        return this.hostId;
    }
    getCache() {
        return this.cache;
    }
    updateCache(host, user) {
        const i = getTranslations(getCurrentLanguage()).host;
        if (this.getHostId() != host.host_id) {
            showNotification(i.overwriteMismatch(this.getHostId(), host.host_id));
            return;
        }
        if (this.cache == null) {
            this.cache = host;
        }
        else {
            // if server_state == null it means this host is offline
            // -> updating cache means setting it to offline
            if (this.cache.server_state != null) {
                Object.assign(this.cache, host);
            }
            else {
                this.cache = host;
            }
        }
        if (user) {
            this.userCache = user;
        }
        // Update Elements
        const customization = getDeviceCustomization(this.hostId);
        this.nameElement.innerText = customization.displayName || this.cache.name;
        if (customization.iconUrl) {
            this.imageElement.src = customization.iconUrl;
        }
        else {
            this.imageElement.src = HOST_IMAGE;
        }
        if (customization.info) {
            this.infoElement.innerText = customization.info;
            this.infoElement.style.display = "block";
        }
        else {
            this.infoElement.innerText = "";
            this.infoElement.style.display = "none";
        }
        const settings = getLocalStreamSettings(globalDefaultSettings());
        let hasStart = false;
        let hasShutdown = false;
        let hasBoot = false;
        if (settings.deviceStartApiUrl) {
            this.btnStart.style.display = "inline-block";
            hasStart = true;
        }
        else {
            this.btnStart.style.display = "none";
        }
        if (settings.deviceForceShutdownApiUrl) {
            this.btnShutdown.style.display = "inline-block";
            hasShutdown = true;
        }
        else {
            this.btnShutdown.style.display = "none";
        }
        if (customization.bootApiUrl) {
            this.btnBoot.style.display = "inline-block";
            hasBoot = true;
        }
        else {
            this.btnBoot.style.display = "none";
        }
        if (hasStart || hasShutdown || hasBoot) {
            this.btnContainer.style.display = "flex";
        }
        else {
            this.btnContainer.style.display = "none";
        }
        if (this.cache.server_state == null) {
            this.imageOverlayElement.src = HOST_OVERLAY_OFFLINE;
        }
        else if (this.cache.paired != "Paired") {
            this.imageOverlayElement.src = HOST_OVERLAY_LOCK;
        }
        else {
            this.imageOverlayElement.src = HOST_OVERLAY_NONE;
        }
    }
    mount(parent) {
        parent.appendChild(this.divElement);
    }
    unmount(parent) {
        parent.removeChild(this.divElement);
    }
}
