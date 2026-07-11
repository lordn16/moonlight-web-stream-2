FROM mrcreativ3001/moonlight-web-stream:latest

# 1. Kopiera CSS-filerna till styles-mappen (Detta fungerar perfekt)
COPY ./dist/styles/standard.css /moonlight-web/static/styles/standard.css
COPY ./dist/styles/moonlight.css /moonlight-web/static/styles/moonlight.css

# 2. Kopiera appearance.js till roten av static ISTÄLLET för styles, 
# ELLER se till att den kopieras exakt dit din HTML förväntar sig den.
COPY ./dist/styles/appearance.js /moonlight-web/static/appearance.js

# 3. Kopiera komponenterna till sina rätta platser
COPY ./dist/component/settings_menu.js /moonlight-web/static/component/settings_menu.js
COPY ./dist/component/host/index.js /moonlight-web/static/component/host/index.js
COPY ./dist/component/host/list.js /moonlight-web/static/component/host/list.js
COPY ./dist/component/host/device_customization.js /moonlight-web/static/component/host/device_customization.js
COPY ./dist/component/host/edit_modal.js /moonlight-web/static/component/host/edit_modal.js