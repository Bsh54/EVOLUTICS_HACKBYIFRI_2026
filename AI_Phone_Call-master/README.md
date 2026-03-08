# Conversation Vocale IA

Interface web pour converser naturellement avec l'intelligence artificielle par la voix.

## Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Bsh54/AI_Phone_Call.git
   cd AI_Phone_Call
   ```

2. **Démarrer un serveur local**
   ```bash
   # Python
   python -m http.server 8000

   # Node.js
   npx serve .

   # PHP
   php -S localhost:8000
   ```

3. **Ouvrir dans le navigateur**
   ```
   http://localhost:8000
   ```

## Utilisation

1. **Configurez** : Choisissez une voix, ajustez vitesse et volume
2. **Cliquez** "Converser avec l'IA"
3. **Parlez** : Cliquez "Parler" et exprimez-vous
4. **Envoyez** : Cliquez "Envoyer" quand votre message est complet
5. **Écoutez** : L'IA vous répond automatiquement

## Prérequis

- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Connexion HTTPS (pour l'accès microphone)
- Autorisation microphone

## Configuration API

Modifiez `script.js` :

```javascript
const API_CONFIG = {
    TTS_API: 'votre-endpoint-tts',
    AI_API: 'votre-endpoint-ia',
    AI_TOKEN: 'votre-token'
};
```

## Déploiement

**GitHub Pages** : Activez dans les paramètres du repository, branche `master`.

**Autres** : Netlify, Vercel, Cloudflare Pages supportés.

## Licence

MIT