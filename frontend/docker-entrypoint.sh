#!/bin/bash
# Script de démarrage pour le conteneur frontend

# Afficher les variables pour débogage
echo "Starting with environment:"
echo "API_URL = ${API_URL}"
echo "REACT_APP_API_URL = ${REACT_APP_API_URL}"

# S'assurer que API_URL a toujours une valeur avec protocole
if [[ "$API_URL" != http* ]]; then
    export API_URL="http://${API_URL:-localhost:5000}"
fi

echo "Using API_URL: $API_URL for nginx configuration"

# Substituer les variables dans la configuration nginx
envsubst '$API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Afficher la configuration générée pour débogage
echo "Generated nginx configuration:"
cat /etc/nginx/conf.d/default.conf

# Démarrer nginx en mode premier plan
nginx -g "daemon off;"
