# API TTS LibreTTS - Déploiement Cloudflare Workers

## API TTS complète

Cette API contient **tout le nécessaire** pour la synthèse vocale :
- Reçoit le texte + paramètres
- Génère l'audio via Microsoft Edge TTS
- Renvoie le fichier MP3 directement

## Déploiement rapide

```bash
cd cloudflare-workers

# Déployer l'API unique
wrangler deploy
```

## Utilisation de l'API

### POST (recommandé)
```bash
curl -X POST https://librettts-api.VOTRE-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour, ceci est un test de synthèse vocale",
    "voice": "fr-FR-DeniseNeural",
    "rate": 0,
    "pitch": 0
  }' \
  --output audio.mp3
```

### GET (simple)
```bash
curl "https://librettts-api.VOTRE-SUBDOMAIN.workers.dev?text=Bonjour&voice=fr-FR-DeniseNeural&rate=10&pitch=-5" \
  --output audio.mp3
```

## Paramètres supportés

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `text` | string | **requis** | Texte à synthétiser |
| `voice` | string | `fr-FR-DeniseNeural` | Voix à utiliser |
| `rate` | number | `0` | Vitesse (-100 à +100) |
| `pitch` | number | `0` | Tonalité (-100 à +100) |
| `format` | string | `audio-24khz-48kbitrate-mono-mp3` | Format audio |

## Voix disponibles (exemples)

**Français :**
- `fr-FR-DeniseNeural` - Denise (France)
- `fr-FR-HenriNeural` - Henri (France)
- `fr-CA-SylvieNeural` - Sylvie (Canada)

**Anglais :**
- `en-US-JennyNeural` - Jenny (États-Unis)
- `en-GB-SoniaNeural` - Sonia (Royaume-Uni)

## Test rapide

Après déploiement, testez directement dans le navigateur :
```
https://librettts-api.VOTRE-SUBDOMAIN.workers.dev?text=Hello%20World&voice=en-US-JennyNeural
```

## Intégration JavaScript

```javascript
async function generateSpeech(text, voice = 'fr-FR-DeniseNeural') {
  const response = await fetch('https://librettts-api.VOTRE-SUBDOMAIN.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice })
  });

  if (response.ok) {
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();
  }
}

// Usage
generateSpeech("Bonjour le monde !");
```

**Avantages :**
- ✅ Une seule URL à retenir
- ✅ Déploiement en une commande
- ✅ Pas de limitations de requêtes
- ✅ Latence mondiale réduite (Edge)
- ✅ CORS activé pour tous domaines