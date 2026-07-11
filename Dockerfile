FROM mrcreativ3001/moonlight-web-stream:latest

# Kopiera din modifierade dist-mapp till den plats där appen körs i containern
# (Obs: Dubbelkolla exakt var appen ligger i original-imagen om detta inte fungerar, 
# men /app/dist eller /usr/share/nginx/html är vanligast beroende på hur den är byggd)
COPY ./dist /app/dist