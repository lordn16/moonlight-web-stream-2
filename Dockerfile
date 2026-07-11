FROM mrcreativ3001/moonlight-web-stream:latest

COPY ./dist/styles/standard.css /moonlight-web/static/styles/standard.css
COPY ./dist/styles/moonlight.css /moonlight-web/static/styles/moonlight.css
COPY ./dist/styles/appearance.js /moonlight-web/static/appearance.js
COPY ./dist/component/settings_menu.js /moonlight-web/static/component/settings_menu.js
COPY ./dist/component/host/index.js /moonlight-web/static/component/host/index.js
COPY ./dist/component/host/list.js /moonlight-web/static/component/host/list.js
COPY ./dist/component/host/device_customization.js /moonlight-web/static/component/host/device_customization.js
COPY ./dist/component/host/edit_modal.js /moonlight-web/static/component/host/edit_modal.js

