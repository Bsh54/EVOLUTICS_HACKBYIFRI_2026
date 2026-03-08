# Guide de Déploiement LibreTTS sur Cloudflare

## Étape 1 : Déployer l'API sur Cloudflare Workers

### 1.1 Installation des outils
```bash
# Installer Node.js depuis https://nodejs.org
# Puis installer Wrangler CLI
npm install -g wrangler
```

### 1.2 Authentification
```bash
# Se connecter à Cloudflare (ouvre une page web)
wrangler login
```

### 1.3 Déployer l'API
```bash
# Aller dans le dossier API
cd "C:\Users\shadr\Downloads\LibreTTS-main\cloudflare-workers"

# Déployer
wrangler deploy
```

**Résultat :** Vous obtiendrez une URL comme `https://librettts-api.VOTRE-SUBDOMAIN.workers.dev`

## Étape 2 : Configurer le Frontend

### 2.1 Modifier l'URL de l'API
Ouvrez `script.js` et remplacez :
```javascript
const API_BASE_URL = 'https://librettts-api.VOTRE-SUBDOMAIN.workers.dev';
```
Par votre vraie URL Workers.

### 2.2 Modifier l'URL dans index.html
Ouvrez `index.html` et remplacez également :
```javascript
const API_BASE_URL = 'https://librettts-api.VOTRE-SUBDOMAIN.workers.dev';
```

## Étape 3 : Déployer le Frontend

### Option A : Cloudflare Pages (Recommandé)
1. Allez sur https://pages.cloudflare.com
2. Connectez votre GitHub/GitLab
3. Uploadez les fichiers : `index.html`, `script.js`, `style.css`, `speakers.json`, `image/`
4. Déployez

### Option B : Netlify
1. Allez sur https://netlify.com
2. Glissez-déposez le dossier principal (sans cloudflare-workers/)
3. Déployez automatiquement

### Option C : Vercel
1. Allez sur https://vercel.com
2. Importez le projet
3. Déployez

## Étape 4 : Test

### Tester l'API directement
```bash
curl "https://VOTRE-API.workers.dev?text=Bonjour&voice=fr-FR-DeniseNeural" --output test.mp3
```

### Tester le site web
Ouvrez votre site déployé et testez la génération de voix.

## Structure finale déployée

```
Frontend (Pages/Netlify/Vercel)
├── index.html
├── script.js (modifié avec votre URL API)
├── style.css
├── speakers.json
└── image/

API (Cloudflare Workers)
└── https://librettts-api.VOTRE-SUBDOMAIN.workers.dev
```

## Avantages de cette architecture

- ✅ **Frontend statique** : Rapide, cacheable, CDN mondial
- ✅ **API serverless** : Pas de serveur à maintenir, scaling automatique
- ✅ **Pas de limites** : Cloudflare Workers = 100k requêtes/jour gratuites
- ✅ **Latence réduite** : Edge computing mondial
- ✅ **Coût minimal** : Gratuit jusqu'à usage intensif

## Dépannage

**Erreur CORS :** L'API inclut déjà les headers CORS pour tous domaines.

**API non trouvée :** Vérifiez que vous avez bien remplacé l'URL dans script.js et index.html.

**Voix non chargées :** Assurez-vous que speakers.json est bien déployé avec le frontend.