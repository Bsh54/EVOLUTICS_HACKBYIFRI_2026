# 🧠 Analyse Approfondie des Systèmes - My AI Front

Ce document détaille le fonctionnement "sous le capot" des systèmes les plus complexes de votre application.

---

## 📁 1. Système de Gestion des Fichiers (Multimodal)

Dans la version ShadsAI, nous avons désactivé l'API de fichiers distante de Google. Voici comment cela fonctionne désormais :

### Flux d'un fichier :
1.  **Sélection :** Quand vous glissez une image, `useFileHandling.ts` capte le fichier.
2.  **Pré-traitement :** L'image est lue localement. Si c'est un PDF ou un fichier texte, il est converti ou lu par les services correspondants.
3.  **Stockage temporaire :** Le fichier est stocké dans l'état `selectedFiles` sous forme de Blob/URL locale pour l'affichage.
4.  **Conversion OpenAI :** Au moment de l'envoi, `chatApi.ts` prend l'image, la transforme en **Base64** et l'insère dans un bloc `image_url` compatible avec votre Worker.

**Où modifier ?**
- Pour changer les types de fichiers autorisés : `constants/fileConstants.ts`.
- Pour changer la compression des images : `utils/mediaUtils.ts`.

---

## ⚡ 2. Moteur de Streaming (Temps Réel)

L'application utilise une lecture par "chunks" (morceaux) pour afficher la réponse de l'IA au fur et à mesure.

### Logique technique (`chatApi.ts`) :
- Nous utilisons `fetch` avec un lecteur de flux (`body.getReader()`).
- Chaque ligne arrivant du serveur est parsée. On cherche la chaîne `data: `.
- **Pensées (Reasoning) :** Si le JSON contient `reasoning_content`, il est envoyé à `onThoughtChunk`.
- **Texte :** Si le JSON contient `content`, il est envoyé à `onPart`.

**Le saviez-vous ?**
L'application utilise un "Buffer" (mémoire tampon) pour s'assurer que si un JSON arrive coupé en deux morceaux, il est recollé avant d'être analysé.

---

## 💾 3. Persistance et Base de Données (IndexedDB)

L'application ne perd rien, même sans compte utilisateur, grâce à **IndexedDB**.

### Structure (`utils/db.ts`) :
- **Table `sessions` :** Stocke les métadonnées des chats (titre, date, modèle utilisé).
- **Table `messages` :** Stocke le contenu intégral, incluant les images en base64.
- **Table `settings` :** Stocke vos préférences de thème et de langue.

**Conseil technique :**
Si vous voulez ajouter une fonctionnalité de "Favoris" sur les messages, vous devrez modifier le schéma de la base de données dans `db.ts` pour ajouter un champ `isFavorite`.

---

## 🎭 4. Système de Thèmes et CSS Dynamique

L'application utilise une approche hybride très puissante :
1.  **React Context :** Gère l'état du thème actif.
2.  **CSS Variables :** Toutes les couleurs sont des variables (`--theme-bg-primary`, etc.) définies dans `styles/main.css`.
3.  **Tailwind :** Utilise ces variables (ex: `bg-[var(--theme-bg-primary)]`).

**Pour créer un thème unique :**
Ajoutez simplement un nouvel objet dans `constants/themeConstants.ts`. L'application le détectera automatiquement et l'ajoutera dans la liste des réglages.

---

## 🔍 5. Le système "Thinking" (Raisonnement)

Votre modèle Gemini 2.5 Flash est capable de "réfléchir" avant de répondre.

### Comment c'est géré :
- **Capture :** `chatApi.ts` extrait le contenu du champ `reasoning_content`.
- **Stockage :** Ce contenu est stocké séparément du texte principal dans l'objet message.
- **Affichage :** `MessageThoughts.tsx` crée un bloc avec une bordure spéciale et un bouton pour masquer/afficher la réflexion.

---

## 🛠️ Outils de Debug Intégrés
L'application possède son propre système de log accessible via l'interface (souvent un onglet "Logs" ou via la console).
- Utilisez `logService.info()` ou `logService.error()` partout dans votre code pour voir ce qui se passe en temps réel dans l'interface de log.

---
*Ce document complète votre formation technique sur le projet.*
