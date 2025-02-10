#!/bin/bash

# Couleurs pour les logs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
REMOTE_USER="luku"
REMOTE_HOST="release.luku.fr"
REMOTE_PATH="/var/www/release.luku.fr"
REMOTE_SERVICE="release-countdown"

echo -e "${GREEN}🚀 Démarrage du déploiement...${NC}"

# Build de l'application
echo -e "${GREEN}📦 Build de l'application...${NC}"
npm run build || { echo -e "${RED}❌ Erreur lors du build${NC}"; exit 1; }

# Création des dossiers distants
echo -e "${GREEN}📁 Création des dossiers sur le serveur...${NC}"
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_PATH"

# Synchronisation des fichiers
echo -e "${GREEN}📤 Transfert des fichiers...${NC}"
rsync -azP --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    dist/ \
    server/ \
    shared/ \
    package*.json \
    $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/ || { echo -e "${RED}❌ Erreur lors du transfert${NC}"; exit 1; }

# Installation des dépendances et redémarrage du service
echo -e "${GREEN}🔄 Installation des dépendances et redémarrage...${NC}"
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && \
    npm install --production && \
    sudo systemctl restart $REMOTE_SERVICE"

echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
