import { getCurrentLanguage, getTranslations } from "../../i18n.js";
import { InputComponent } from "../input.js";
import { FormModal } from "../modal/form.js";
export class EditDeviceModal extends FormModal {
    constructor(initialValues) {
        super();
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
    }
    reset() {
        this.displayName.reset();
        this.iconUrl.reset();
        this.info.reset();
        this.bootApiUrl.reset();
    }
    submit() {
        return {
            displayName: this.displayName.getValue(),
            iconUrl: this.iconUrl.getValue(),
            info: this.info.getValue(),
            bootApiUrl: this.bootApiUrl.getValue()
        };
    }
    mountForm(form) {
        form.appendChild(this.header);
        this.displayName.mount(form);
        this.iconUrl.mount(form);
        this.info.mount(form);
        this.bootApiUrl.mount(form);
    }
}

