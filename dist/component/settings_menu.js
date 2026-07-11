import { getLanguageOptions, getTranslations, normalizeLanguage } from "../i18n.js";
import { ComponentEvent } from "./index.js";
import { InputComponent, SelectComponent } from "./input.js";
import DEFAULT_SETTINGS from "../default_settings.js";
/// You should use the role default settings instead!
export function globalDefaultSettings() {
    // We are deep cloning this
    return deepClone(DEFAULT_SETTINGS);
}
function deepClone(value) {
    if (typeof structuredClone == "function") {
        return structuredClone(value);
    }
    else {
        return JSON.parse(JSON.stringify(value));
    }
}
function deepMerge(target, source) {
    for (const key in source) {
        const sourceVal = source[key];
        const targetVal = target[key];
        if (sourceVal &&
            typeof sourceVal === "object" &&
            !Array.isArray(sourceVal)) {
            target[key] = deepMerge(targetVal && typeof targetVal === "object" ? targetVal : {}, sourceVal);
        }
        else if (sourceVal !== undefined) {
            target[key] = sourceVal;
        }
    }
    return target;
}
export function getLocalStreamSettings(defaultSettings) {
    // Start with FULL global defaults
    let settings = globalDefaultSettings();
    // Fill/override with role defaults (even if partial)
    settings = deepMerge(settings, defaultSettings);
    try {
        const json = localStorage.getItem("mlSettings");
        if (json) {
            const loaded = JSON.parse(json);
            // Finally override with user settings
            settings = deepMerge(settings, loaded);
        }
    }
    catch (e) {
        localStorage.removeItem("mlSettings");
    }
    // Migration
    if ((settings === null || settings === void 0 ? void 0 : settings.pageStyle) === "old") {
        settings.pageStyle = "moonlight";
    }
    return settings;
}
export function setLocalStreamSettings(settings) {
    localStorage.setItem("mlSettings", JSON.stringify(settings));
}
function makeSettingsValid(permissions, settings) {
    if (permissions.maximum_bitrate_kbps != null && permissions.maximum_bitrate_kbps < settings.bitrate) {
        settings.bitrate = permissions.maximum_bitrate_kbps;
    }
    if (!permissions.allow_codec_av1 && settings.videoCodec == "av1") {
        settings.videoCodec = "h265";
    }
    if (!permissions.allow_codec_h265 && settings.videoCodec == "h265") {
        settings.videoCodec = "h264";
    }
    if (!permissions.allow_codec_h264 && settings.videoCodec == "h264") {
        settings.videoCodec = "auto";
    }
    if (!permissions.allow_hdr && settings.hdr) {
        settings.hdr = false;
    }
    if (!permissions.allow_transport_webrtc && settings.dataTransport == "webrtc") {
        settings.dataTransport = "auto";
    }
    if (!permissions.allow_transport_websockets && settings.dataTransport == "websocket") {
        settings.dataTransport = "auto";
    }
    if (!Number.isFinite(settings.localCursorSensitivity) || settings.localCursorSensitivity <= 0) {
        settings.localCursorSensitivity = globalDefaultSettings().localCursorSensitivity;
    }
}
export class StreamSettingsComponent {
    constructor(permissions, settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        this.divElement = document.createElement("div");
        this.sidebarHeader = document.createElement("h3");
        this.streamHeader = document.createElement("h3");
        this.audioHeader = document.createElement("h3");
        this.mouseHeader = document.createElement("h3");
        this.controllerHeader = document.createElement("h3");
        this.otherHeader = document.createElement("h3");
        this.appearanceHeader = document.createElement("h3");
        this.secretApiHeader = document.createElement("h3");
        // Sometimes the normal settings object doesn't have some values, because they change between versions.
        // Use those as fallback
        const defaultSettings_ = globalDefaultSettings();
        makeSettingsValid(permissions, defaultSettings_);
        makeSettingsValid(permissions, settings);
        this.permissions = permissions;
        const language = normalizeLanguage((_o = settings === null || settings === void 0 ? void 0 : settings.language) !== null && _o !== void 0 ? _o : defaultSettings_.language);
        const translations = getTranslations(language);
        const i = translations.settings;
        const streamI = translations.stream;
        // Root div
        this.divElement.classList.add("settings");
        // Close button
        this.closeButton = document.createElement("button");
        this.closeButton.classList.add("settings-close-btn");
        this.closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        this.closeButton.addEventListener("click", () => {
            // Trigger slide-down exit animation, then close
            this.divElement.classList.add("settings-leaving");
            this.divElement.addEventListener("animationend", () => {
                this.divElement.dispatchEvent(new CustomEvent("close-settings", { bubbles: true }));
            }, { once: true });
        });
        this.divElement.appendChild(this.closeButton);
        // Sidebar
        this.sidebarHeader.innerText = i.sidebar;
        this.divElement.appendChild(this.sidebarHeader);
        this.sidebarEdge = new SelectComponent("sidebarEdge", [
            { value: "left", name: i.left },
            { value: "right", name: i.right },
            { value: "up", name: i.up },
            { value: "down", name: i.down },
        ], {
            displayName: i.sidebarEdge,
            preSelectedOption: (_p = settings === null || settings === void 0 ? void 0 : settings.sidebarEdge) !== null && _p !== void 0 ? _p : defaultSettings_.sidebarEdge,
        });
        this.sidebarEdge.addChangeListener(this.onSettingsChange.bind(this));
        this.sidebarEdge.mount(this.divElement);
        // Video
        this.streamHeader.innerText = i.video;
        this.divElement.appendChild(this.streamHeader);
        // Bitrate
        this.bitrate = new InputComponent("bitrate", "number", i.bitrate, {
            defaultValue: defaultSettings_.bitrate.toString(),
            value: (_a = settings === null || settings === void 0 ? void 0 : settings.bitrate) === null || _a === void 0 ? void 0 : _a.toString(),
            step: "100",
            numberSlider: {
                range_min: Math.min((_q = this.permissions.maximum_bitrate_kbps) !== null && _q !== void 0 ? _q : 1000, 1000),
                range_max: (_r = this.permissions.maximum_bitrate_kbps) !== null && _r !== void 0 ? _r : 10000,
            }
        });
        this.bitrate.addChangeListener(this.onSettingsChange.bind(this));
        this.bitrate.mount(this.divElement);
        // Fps
        this.fps = new InputComponent("fps", "number", i.fps, {
            defaultValue: defaultSettings_.fps.toString(),
            value: (_b = settings === null || settings === void 0 ? void 0 : settings.fps) === null || _b === void 0 ? void 0 : _b.toString(),
            step: "100"
        });
        this.fps.addChangeListener(this.onSettingsChange.bind(this));
        this.fps.mount(this.divElement);
        // Video Size
        this.videoSize = new SelectComponent("videoSize", [
            { value: "720p", name: "720p" },
            { value: "1080p", name: "1080p" },
            { value: "1440p", name: "1440p" },
            { value: "4k", name: "4k" },
            { value: "native", name: i.native },
            { value: "custom", name: i.custom }
        ], {
            displayName: i.videoSize,
            preSelectedOption: (settings === null || settings === void 0 ? void 0 : settings.videoSize) || defaultSettings_.videoSize
        });
        this.videoSize.addChangeListener(this.onSettingsChange.bind(this));
        this.videoSize.mount(this.divElement);
        this.videoSizeWidth = new InputComponent("videoSizeWidth", "number", i.videoWidth, {
            defaultValue: defaultSettings_.videoSizeCustom.width.toString(),
            value: (_c = settings === null || settings === void 0 ? void 0 : settings.videoSizeCustom) === null || _c === void 0 ? void 0 : _c.width.toString()
        });
        this.videoSizeWidth.addChangeListener(this.onSettingsChange.bind(this));
        this.videoSizeWidth.mount(this.divElement);
        this.videoSizeHeight = new InputComponent("videoSizeHeight", "number", i.videoHeight, {
            defaultValue: defaultSettings_.videoSizeCustom.height.toString(),
            value: (_d = settings === null || settings === void 0 ? void 0 : settings.videoSizeCustom) === null || _d === void 0 ? void 0 : _d.height.toString()
        });
        this.videoSizeHeight.addChangeListener(this.onSettingsChange.bind(this));
        this.videoSizeHeight.mount(this.divElement);
        // Video Sample Queue Size
        this.videoSampleQueueSize = new InputComponent("videoFrameQueueSize", "number", i.videoFrameQueueSize, {
            defaultValue: defaultSettings_.videoFrameQueueSize.toString(),
            value: (_e = settings === null || settings === void 0 ? void 0 : settings.videoFrameQueueSize) === null || _e === void 0 ? void 0 : _e.toString()
        });
        this.videoSampleQueueSize.addChangeListener(this.onSettingsChange.bind(this));
        this.videoSampleQueueSize.mount(this.divElement);
        // Codec
        const allowedVideoCodecs = [
            { value: "auto", name: i.autoExperimental },
        ];
        if (this.permissions.allow_codec_h264) {
            allowedVideoCodecs.push({ value: "h264", name: "H264" });
        }
        if (this.permissions.allow_codec_h265) {
            allowedVideoCodecs.push({ value: "h265", name: "H265" });
        }
        if (this.permissions.allow_codec_av1) {
            allowedVideoCodecs.push({ value: "av1", name: i.av1Experimental });
        }
        this.videoCodec = new SelectComponent("videoCodec", allowedVideoCodecs, {
            displayName: i.videoCodec,
            preSelectedOption: (_s = settings === null || settings === void 0 ? void 0 : settings.videoCodec) !== null && _s !== void 0 ? _s : defaultSettings_.videoCodec
        });
        this.videoCodec.addChangeListener(this.onSettingsChange.bind(this));
        this.videoCodec.mount(this.divElement);
        // Force Video Element renderer
        this.forceVideoElementRenderer = new InputComponent("forceVideoElementRenderer", "checkbox", i.forceVideoElementRenderer, {
            checked: (_t = settings === null || settings === void 0 ? void 0 : settings.forceVideoElementRenderer) !== null && _t !== void 0 ? _t : defaultSettings_.forceVideoElementRenderer
        });
        this.forceVideoElementRenderer.addChangeListener(this.onSettingsChange.bind(this));
        this.forceVideoElementRenderer.mount(this.divElement);
        // Use Canvas Renderer
        this.canvasRenderer = new InputComponent("canvasRenderer", "checkbox", i.useCanvasRenderer, {
            defaultValue: defaultSettings_.canvasRenderer.toString(),
            checked: settings === null || settings === void 0 ? void 0 : settings.canvasRenderer
        });
        this.canvasRenderer.addChangeListener(this.onSettingsChange.bind(this));
        this.canvasRenderer.mount(this.divElement);
        // Canvas VSync (Canvas only: sync draw to display refresh to reduce tearing; off = lower latency)
        this.canvasVsync = new InputComponent("canvasVsync", "checkbox", i.canvasVsync, {
            checked: (_u = settings === null || settings === void 0 ? void 0 : settings.canvasVsync) !== null && _u !== void 0 ? _u : defaultSettings_.canvasVsync
        });
        this.canvasVsync.addChangeListener(this.onSettingsChange.bind(this));
        this.canvasVsync.mount(this.divElement);
        // HDR
        this.hdr = new InputComponent("hdr", "checkbox", i.enableHdr, {
            checked: (_v = settings === null || settings === void 0 ? void 0 : settings.hdr) !== null && _v !== void 0 ? _v : defaultSettings_.hdr
        });
        this.hdr.addChangeListener(this.onSettingsChange.bind(this));
        this.hdr.mount(this.divElement);
        if (!this.permissions.allow_hdr) {
            this.hdr.setChecked(false);
            this.hdr.setEnabled(false);
        }
        // Audio local
        this.audioHeader.innerText = i.audio;
        this.divElement.appendChild(this.audioHeader);
        this.playAudioLocal = new InputComponent("playAudioLocal", "checkbox", i.playAudioLocal, {
            checked: settings === null || settings === void 0 ? void 0 : settings.playAudioLocal
        });
        this.playAudioLocal.addChangeListener(this.onSettingsChange.bind(this));
        this.playAudioLocal.mount(this.divElement);
        // Audio Sample Queue Size
        this.audioSampleQueueSize = new InputComponent("audioSampleQueueSize", "number", i.audioSampleQueueSize, {
            defaultValue: defaultSettings_.audioSampleQueueSize.toString(),
            value: (_f = settings === null || settings === void 0 ? void 0 : settings.audioSampleQueueSize) === null || _f === void 0 ? void 0 : _f.toString()
        });
        this.audioSampleQueueSize.addChangeListener(this.onSettingsChange.bind(this));
        this.audioSampleQueueSize.mount(this.divElement);
        // Mouse
        this.mouseHeader.innerText = i.mouse;
        this.divElement.appendChild(this.mouseHeader);
        this.mouseScrollMode = new SelectComponent("mouseScrollMode", [
            { value: "highres", name: i.highRes },
            { value: "normal", name: i.normal }
        ], {
            displayName: i.scrollMode,
            preSelectedOption: (settings === null || settings === void 0 ? void 0 : settings.mouseScrollMode) || defaultSettings_.mouseScrollMode
        });
        this.mouseScrollMode.addChangeListener(this.onSettingsChange.bind(this));
        this.mouseScrollMode.mount(this.divElement);
        this.mouseMode = new SelectComponent("mouseMode", [
            { value: "relative", name: streamI.relative },
            { value: "follow", name: streamI.follow },
            { value: "localCursor", name: streamI.localCursor },
            { value: "pointAndDrag", name: streamI.pointAndDrag }
        ], {
            displayName: i.startupMouseMode,
            preSelectedOption: (_w = settings === null || settings === void 0 ? void 0 : settings.mouseMode) !== null && _w !== void 0 ? _w : defaultSettings_.mouseMode
        });
        this.mouseMode.addChangeListener(this.onSettingsChange.bind(this));
        this.mouseMode.mount(this.divElement);
        this.touchMode = new SelectComponent("touchMode", [
            { value: "touch", name: streamI.touch },
            { value: "mouseRelative", name: streamI.relative },
            { value: "localCursor", name: streamI.localCursor },
            { value: "pointAndDrag", name: streamI.pointAndDrag }
        ], {
            displayName: i.startupTouchMode,
            preSelectedOption: (_x = settings === null || settings === void 0 ? void 0 : settings.touchMode) !== null && _x !== void 0 ? _x : defaultSettings_.touchMode
        });
        this.touchMode.addChangeListener(this.onSettingsChange.bind(this));
        this.touchMode.mount(this.divElement);
        this.localCursorSensitivity = new InputComponent("localCursorSensitivity", "number", i.localCursorSensitivity, {
            defaultValue: defaultSettings_.localCursorSensitivity.toString(),
            value: (_g = settings === null || settings === void 0 ? void 0 : settings.localCursorSensitivity) === null || _g === void 0 ? void 0 : _g.toString(),
            step: "0.1",
            numberSlider: {
                range_min: 0.1,
                range_max: 3
            }
        });
        this.localCursorSensitivity.addChangeListener(this.onSettingsChange.bind(this));
        this.localCursorSensitivity.mount(this.divElement);
        // Controller
        if (window.isSecureContext) {
            this.controllerHeader.innerText = i.controller;
        }
        else {
            this.controllerHeader.innerText = i.controllerDisabled;
        }
        this.divElement.appendChild(this.controllerHeader);
        this.controllerInvertAB = new InputComponent("controllerInvertAB", "checkbox", i.invertAB, {
            checked: (_h = settings === null || settings === void 0 ? void 0 : settings.controllerConfig) === null || _h === void 0 ? void 0 : _h.invertAB
        });
        this.controllerInvertAB.addChangeListener(this.onSettingsChange.bind(this));
        this.controllerInvertAB.mount(this.divElement);
        this.controllerInvertXY = new InputComponent("controllerInvertXY", "checkbox", i.invertXY, {
            checked: (_j = settings === null || settings === void 0 ? void 0 : settings.controllerConfig) === null || _j === void 0 ? void 0 : _j.invertXY
        });
        this.controllerInvertXY.addChangeListener(this.onSettingsChange.bind(this));
        this.controllerInvertXY.mount(this.divElement);
        // Controller Send Interval
        this.controllerSendIntervalOverride = new InputComponent("controllerSendIntervalOverride", "number", i.overrideControllerInterval, {
            hasEnableCheckbox: true,
            defaultValue: "20",
            value: (_l = (_k = settings === null || settings === void 0 ? void 0 : settings.controllerConfig) === null || _k === void 0 ? void 0 : _k.sendIntervalOverride) === null || _l === void 0 ? void 0 : _l.toString(),
            numberSlider: {
                range_min: 10,
                range_max: 120
            }
        });
        this.controllerSendIntervalOverride.setEnabled(((_m = settings === null || settings === void 0 ? void 0 : settings.controllerConfig) === null || _m === void 0 ? void 0 : _m.sendIntervalOverride) != null);
        this.controllerSendIntervalOverride.addChangeListener(this.onSettingsChange.bind(this));
        this.controllerSendIntervalOverride.mount(this.divElement);
        if (!window.isSecureContext) {
            this.controllerInvertAB.setEnabled(false);
            this.controllerInvertXY.setEnabled(false);
        }
        // Other
        this.otherHeader.innerText = i.other;
        this.divElement.appendChild(this.otherHeader);
        // Data Transport
        const allowedDataTransport = [
            { value: "auto", name: i.auto },
        ];
        if (this.permissions.allow_transport_webrtc) {
            allowedDataTransport.push({ value: "webrtc", name: "WebRTC" });
        }
        if (this.permissions.allow_transport_websockets) {
            allowedDataTransport.push({ value: "websocket", name: i.webSocket });
        }
        this.language = new SelectComponent("language", getLanguageOptions(), {
            displayName: i.language,
            preSelectedOption: language
        });
        this.language.addChangeListener(this.onSettingsChange.bind(this));
        this.language.mount(this.divElement);
        this.dataTransport = new SelectComponent("transport", allowedDataTransport, {
            displayName: i.dataTransport,
            preSelectedOption: (_y = settings === null || settings === void 0 ? void 0 : settings.dataTransport) !== null && _y !== void 0 ? _y : defaultSettings_.dataTransport
        });
        this.dataTransport.addChangeListener(this.onSettingsChange.bind(this));
        this.dataTransport.mount(this.divElement);
        this.enterFullscreenOnStreamStart = new InputComponent("enterFullscreenOnStreamStart", "checkbox", i.enterFullscreenOnStreamStart, {
            checked: (_z = settings === null || settings === void 0 ? void 0 : settings.enterFullscreenOnStreamStart) !== null && _z !== void 0 ? _z : defaultSettings_.enterFullscreenOnStreamStart
        });
        this.enterFullscreenOnStreamStart.addChangeListener(this.onSettingsChange.bind(this));
        this.enterFullscreenOnStreamStart.mount(this.divElement);
        // Fullscreen Keybind
        this.toggleFullscreenWithKeybind = new InputComponent("toggleFullscreenWithKeybind", "checkbox", i.toggleFullscreenWithKeybind, {
            checked: settings === null || settings === void 0 ? void 0 : settings.toggleFullscreenWithKeybind
        });
        this.toggleFullscreenWithKeybind.addChangeListener(this.onSettingsChange.bind(this));
        this.toggleFullscreenWithKeybind.mount(this.divElement);
        // Page Style
        this.pageStyle = new SelectComponent("pageStyle", [
            { value: "standard", name: "Standard" },
            { value: "moonlight", name: "Moonlight" },
        ], {
            displayName: i.style,
            preSelectedOption: (_0 = settings === null || settings === void 0 ? void 0 : settings.pageStyle) !== null && _0 !== void 0 ? _0 : defaultSettings_.pageStyle
        });
        this.pageStyle.addChangeListener(this.onSettingsChange.bind(this));
        this.pageStyle.mount(this.divElement);
        // Custom Select Element
        this.useSelectElementPolyfill = new InputComponent("useSelectElementPolyfill", "checkbox", i.useCustomDropdown, {
            checked: (_1 = settings === null || settings === void 0 ? void 0 : settings.useSelectElementPolyfill) !== null && _1 !== void 0 ? _1 : defaultSettings_.useSelectElementPolyfill
        });
        this.useSelectElementPolyfill.addChangeListener(this.onSettingsChange.bind(this));
        this.useSelectElementPolyfill.mount(this.divElement);
        // Appearance
        this.appearanceHeader.innerText = i.appearance;
        this.divElement.appendChild(this.appearanceHeader);
        this.backgroundImageUrl = new InputComponent("backgroundImageUrl", "text", i.backgroundImageUrl, {
            defaultValue: defaultSettings_.backgroundImageUrl,
            value: (_2 = settings === null || settings === void 0 ? void 0 : settings.backgroundImageUrl) !== null && _2 !== void 0 ? _2 : defaultSettings_.backgroundImageUrl,
            placeholer: i.backgroundImageUrlHelp
        });
        this.backgroundImageUrl.addChangeListener(this.onSettingsChange.bind(this));
        this.backgroundImageUrl.mount(this.divElement);
        // Secret APIs
        this.secretApiHeader.innerText = "API Options";
        this.divElement.appendChild(this.secretApiHeader);
        this.deviceStartApiUrl = new InputComponent("deviceStartApiUrl", "text", i.deviceStartApiUrl, {
            defaultValue: defaultSettings_.deviceStartApiUrl,
            value: (_3 = settings === null || settings === void 0 ? void 0 : settings.deviceStartApiUrl) !== null && _3 !== void 0 ? _3 : defaultSettings_.deviceStartApiUrl,
            placeholer: i.secretApiHelp
        });
        this.deviceStartApiUrl.addChangeListener(this.onSettingsChange.bind(this));
        this.deviceStartApiUrl.mount(this.divElement);
        this.deviceForceShutdownApiUrl = new InputComponent("deviceForceShutdownApiUrl", "text", i.deviceForceShutdownApiUrl, {
            defaultValue: defaultSettings_.deviceForceShutdownApiUrl,
            value: (_4 = settings === null || settings === void 0 ? void 0 : settings.deviceForceShutdownApiUrl) !== null && _4 !== void 0 ? _4 : defaultSettings_.deviceForceShutdownApiUrl,
            placeholer: i.secretApiHelp
        });
        this.deviceForceShutdownApiUrl.addChangeListener(this.onSettingsChange.bind(this));
        this.deviceForceShutdownApiUrl.mount(this.divElement);
        this.onSettingsChange();
    }
    onSettingsChange() {
        if (this.videoSize.getValue() == "custom") {
            this.videoSizeWidth.setEnabled(true);
            this.videoSizeHeight.setEnabled(true);
        }
        else {
            this.videoSizeWidth.setEnabled(false);
            this.videoSizeHeight.setEnabled(false);
        }
        this.divElement.dispatchEvent(new ComponentEvent("ml-settingschange", this));
    }
    addChangeListener(listener) {
        this.divElement.addEventListener("ml-settingschange", listener);
    }
    removeChangeListener(listener) {
        this.divElement.removeEventListener("ml-settingschange", listener);
    }
    getStreamSettings() {
        const settings = globalDefaultSettings();
        settings.sidebarEdge = this.sidebarEdge.getValue();
        settings.bitrate = parseInt(this.bitrate.getValue());
        settings.fps = parseInt(this.fps.getValue());
        settings.videoSize = this.videoSize.getValue();
        settings.videoSizeCustom = {
            width: parseInt(this.videoSizeWidth.getValue()),
            height: parseInt(this.videoSizeHeight.getValue())
        };
        settings.videoFrameQueueSize = parseInt(this.videoSampleQueueSize.getValue());
        settings.videoCodec = this.videoCodec.getValue();
        settings.forceVideoElementRenderer = this.forceVideoElementRenderer.isChecked();
        settings.canvasRenderer = this.canvasRenderer.isChecked();
        settings.canvasVsync = this.canvasVsync.isChecked();
        settings.playAudioLocal = this.playAudioLocal.isChecked();
        settings.audioSampleQueueSize = parseInt(this.audioSampleQueueSize.getValue());
        settings.mouseScrollMode = this.mouseScrollMode.getValue();
        settings.mouseMode = this.mouseMode.getValue();
        settings.touchMode = this.touchMode.getValue();
        settings.localCursorSensitivity = parseFloat(this.localCursorSensitivity.getValue());
        settings.controllerConfig.invertAB = this.controllerInvertAB.isChecked();
        settings.controllerConfig.invertXY = this.controllerInvertXY.isChecked();
        if (this.controllerSendIntervalOverride.isEnabled()) {
            settings.controllerConfig.sendIntervalOverride = parseInt(this.controllerSendIntervalOverride.getValue());
        }
        else {
            settings.controllerConfig.sendIntervalOverride = null;
        }
        settings.dataTransport = this.dataTransport.getValue();
        settings.language = this.language.getValue();
        settings.enterFullscreenOnStreamStart = this.enterFullscreenOnStreamStart.isChecked();
        settings.toggleFullscreenWithKeybind = this.toggleFullscreenWithKeybind.isChecked();
        settings.pageStyle = this.pageStyle.getValue();
        settings.hdr = this.hdr.isChecked();
        settings.useSelectElementPolyfill = this.useSelectElementPolyfill.isChecked();
        settings.backgroundImageUrl = this.backgroundImageUrl.getValue();
        settings.deviceStartApiUrl = this.deviceStartApiUrl.getValue();
        settings.deviceForceShutdownApiUrl = this.deviceForceShutdownApiUrl.getValue();
        makeSettingsValid(this.permissions, settings);
        return settings;
    }
    mountBefore(parent, before) {
        parent.insertBefore(this.divElement, before);
    }
    mount(parent) {
        this.divElement.classList.remove("settings-leaving");
        parent.appendChild(this.divElement);
    }
    unmount(parent) {
        parent.removeChild(this.divElement);
    }
}
