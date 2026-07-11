FROM mrcreativ3001/moonlight-web-stream:latest

# CSS
COPY ./dist/styles/standard.css /moonlight-web/static/styles/standard.css
COPY ./dist/styles/moonlight.css /moonlight-web/static/styles/moonlight.css

# Dina modifierade filer (Nu med all din logik samlad i appearance.js)
COPY ./dist/styles/appearance.js /moonlight-web/static/styles/appearance.js

# Dina komponenter (Håll koll på att dessa inte har "browser.runtime" i sig)
COPY ./dist/component/settings_menu.js /moonlight-web/static/component/settings_menu.js
COPY ./dist/component/host/index.js /moonlight-web/static/component/host/index.js
COPY ./dist/component/host/list.js /moonlight-web/static/component/host/list.js
COPY ./dist/component/host/device_customization.js /moonlight-web/static/component/host/device_customization.js
COPY ./dist/component/host/edit_modal.js /moonlight-web/static/component/host/edit_modal.js