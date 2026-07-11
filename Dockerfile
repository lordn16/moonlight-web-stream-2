FROM mrcreativ3001/moonlight-web-stream:latest

# 1. CSS (Design)
COPY ./dist/styles/standard.css /moonlight-web/static/styles/standard.css
COPY ./dist/styles/moonlight.css /moonlight-web/static/styles/moonlight.css

# 2. HTML (Som länkar in original-JS från imagen)
COPY ./dist/index.html /moonlight-web/static/index.html

# 3. Styles JS (setStyle + applyAppearanceSettings – måste ligga i styles/)
COPY ./dist/styles/index.js /moonlight-web/static/styles/index.js
COPY ./dist/styles/appearance.js /moonlight-web/static/styles/appearance.js

# 4. Komponenter (våra anpassade versioner)
COPY ./dist/component/settings_menu.js /moonlight-web/static/component/settings_menu.js
COPY ./dist/component/host/index.js /moonlight-web/static/component/host/index.js
COPY ./dist/component/host/list.js /moonlight-web/static/component/host/list.js
COPY ./dist/component/host/device_customization.js /moonlight-web/static/component/host/device_customization.js
COPY ./dist/component/host/edit_modal.js /moonlight-web/static/component/host/edit_modal.js