FROM mrcreativ3001/moonlight-web-stream:latest

# 1. CSS (Design)
COPY ./dist/styles/standard.css /moonlight-web/static/styles/standard.css
COPY ./dist/styles/moonlight.css /moonlight-web/static/styles/moonlight.css

# 2. HTML + Main App JS (med custom navbar-titel)
COPY ./dist/index.html /moonlight-web/static/index.html
COPY ./dist/index.js /moonlight-web/static/index.js

# 3. Styles JS (setStyle + applyAppearanceSettings – måste ligga i styles/)
COPY ./dist/styles/index.js /moonlight-web/static/styles/index.js
COPY ./dist/styles/appearance.js /moonlight-web/static/styles/appearance.js

# 3b. Core JS med tilläggslogik
COPY ./dist/default_settings.js /moonlight-web/static/default_settings.js
COPY ./dist/component/notification.js /moonlight-web/static/component/notification.js

# 4. Locale-filer (med våra extra API-URL-keys)
COPY ./dist/locales/en.js /moonlight-web/static/locales/en.js
COPY ./dist/locales/fr-FR.js /moonlight-web/static/locales/fr-FR.js
COPY ./dist/locales/zh-CN.js /moonlight-web/static/locales/zh-CN.js
COPY ./dist/locales/pt-BR.js /moonlight-web/static/locales/pt-BR.js
COPY ./dist/locales/ko-KR.js /moonlight-web/static/locales/ko-KR.js

# 5. Favicon
COPY ./dist/resources/favicon.svg /moonlight-web/static/resources/favicon.svg

# 6. Komponenter (våra anpassade versioner)
COPY ./dist/component/settings_menu.js /moonlight-web/static/component/settings_menu.js
COPY ./dist/component/host/index.js /moonlight-web/static/component/host/index.js
COPY ./dist/component/host/list.js /moonlight-web/static/component/host/list.js
COPY ./dist/component/host/device_customization.js /moonlight-web/static/component/host/device_customization.js
COPY ./dist/component/host/edit_modal.js /moonlight-web/static/component/host/edit_modal.js