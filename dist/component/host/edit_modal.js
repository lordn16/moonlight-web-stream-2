import { getCurrentLanguage, getTranslations } from "../../i18n.js";
import { InputComponent } from "../input.js";
import { FormModal } from "../modal/form.js";
export class EditDeviceModal extends FormModal {
    constructor(initialValues) {
        super();
        this.initialValues = initialValues;
        this.header = document.createElement("h2");
        const i = getTranslations(getCurrentLanguage()).host;
        this.header.innerText = i.editDeviceHeader;
        this.displayName = new InputComponent("displayName", "text", i.displayName, {
            value: initialValues.displayName || ""
        });
        this.iconUrl = new InputComponent("iconUrl", "text", i.iconUrl, {
            value: initialValues.iconUrl || "",
            placeholer: i.iconUrlHelp
        });
        this.info = new InputComponent("info", "text", i.info, {
            value: initialValues.info || ""
        });
        this.bootApiUrl = new InputComponent("bootApiUrl", "text", i.bootApiUrl || "Boot API URL", {
            value: initialValues.bootApiUrl || "",
            placeholer: i.bootApiUrlHelp || "URL to trigger boot/power state"
        });
        this.shutdownApiUrl = new InputComponent("shutdownApiUrl", "text", i.shutdownApiUrl || "Force Off API URL", {
            value: initialValues.shutdownApiUrl || "",
            placeholer: i.shutdownApiUrlHelp || "URL to force shutdown"
        });
        this.statusApiUrl = new InputComponent("statusApiUrl", "text", i.statusApiUrl || "Status API URL", {
            value: initialValues.statusApiUrl || "",
            placeholer: i.statusApiUrlHelp || "URL to check online/offline and uptime status"
        });
        this.f7ApiUrl = new InputComponent("f7ApiUrl", "text", i.f7ApiUrl || "F7 Toggle API URL", {
            value: initialValues.f7ApiUrl || "",
            placeholer: i.f7ApiUrlHelp || "URL template (supports {enabled} and {state})"
        });
    }
    reset() {
        var _a, _b, _c, _d, _e, _f, _g;
        this.displayName.setValue((_a = this.initialValues.displayName) !== null && _a !== void 0 ? _a : "");
        this.iconUrl.setValue((_b = this.initialValues.iconUrl) !== null && _b !== void 0 ? _b : "");
        this.info.setValue((_c = this.initialValues.info) !== null && _c !== void 0 ? _c : "");
        this.bootApiUrl.setValue((_d = this.initialValues.bootApiUrl) !== null && _d !== void 0 ? _d : "");
        this.shutdownApiUrl.setValue((_e = this.initialValues.shutdownApiUrl) !== null && _e !== void 0 ? _e : "");
        this.statusApiUrl.setValue((_f = this.initialValues.statusApiUrl) !== null && _f !== void 0 ? _f : "");
        this.f7ApiUrl.setValue((_g = this.initialValues.f7ApiUrl) !== null && _g !== void 0 ? _g : "");
    }
    submit() {
        return {
            displayName: this.displayName.getValue(),
            iconUrl: this.iconUrl.getValue(),
            info: this.info.getValue(),
            bootApiUrl: this.bootApiUrl.getValue(),
            shutdownApiUrl: this.shutdownApiUrl.getValue(),
            statusApiUrl: this.statusApiUrl.getValue(),
            f7ApiUrl: this.f7ApiUrl.getValue()
        };
    }
    mountForm(form) {
        form.appendChild(this.header);
        this.displayName.mount(form);
        this.iconUrl.mount(form);
        this.info.mount(form);
        this.bootApiUrl.mount(form);
        this.shutdownApiUrl.mount(form);
        this.statusApiUrl.mount(form);
        this.f7ApiUrl.mount(form);
    }
}

