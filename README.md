# 🚀 EVOLUTICS — Votre tremplin vers le monde professionnel

<div align="center">
  <img src="https://img.shields.io/badge/HACKBYIFRI-2026-FF6600?style=for-the-badge&logo=target&logoColor=white" alt="Hackathon">
  <img src="https://img.shields.io/badge/Thème-Insertion_Pro-blue?style=for-the-badge" alt="Thème">
  <br/>
  <p><strong>La plateforme intelligente qui connecte les étudiants aux opportunités et les prépare à réussir grâce à l'Intelligence Artificielle.</strong></p>
</div>

---

## 💡 Présentation du Projet

**EVOLUTICS** est née d'un constat simple : les étudiants ont souvent du mal à trouver des offres qui leur correspondent et se sentent parfois démunis face aux recruteurs.

Notre solution est un véritable **compagnon de carrière**. Elle ne se contente pas d'afficher des offres (stages, emplois, bourses, concours), elle intègre un **Coach IA personnel**. Cet assistant aide l'étudiant à rédiger son CV, préparer ses lettres de motivation, et même simuler des entretiens en se basant spécifiquement sur l'offre qui l'intéresse.

### ✨ Ce que propose EVOLUTICS :

- 🎓 **Un catalogue d'opportunités ciblé** : Trouvez facilement des stages, des emplois ou des formations adaptés à votre profil.
- 🤖 **Un Coach Carrière Personnel (IA)** : Un assistant intelligent toujours disponible pour vous conseiller, corriger votre CV ou vous entraîner pour un entretien.
- 👤 **Un profil étudiant complet** : Mettez en valeur votre parcours, vos compétences et vos aspirations.
- 🎨 **Une expérience belle et intuitive** : Une application fluide et facile à utiliser, pensée d'abord pour le confort des étudiants (sur téléphone comme sur ordinateur).

---

## 🚀 Guide d'Exécution (Comment lancer le projet)

Suivez ces quelques étapes simples pour faire tourner l'application sur votre propre machine.

### 1. Préparer le terrain
Assurez-vous d'avoir installé sur votre ordinateur :
- **Node.js** (le programme de base pour faire tourner l'application)
- Un compte **Supabase** (pour stocker les annonces et les profils)
- Une clé **Google Gemini** (pour faire fonctionner l'Intelligence Artificielle)

### 2. Récupérer le projet
Ouvrez votre terminal (ou invite de commande) et tapez :
```bash
git clone https://github.com/Bsh54/EVOLUTICS_HACKBYIFRI_2026.git
cd EVOLUTICS_HACKBYIFRI_2026/all-model-chat
```

### 3. Installer les composants
Lancez l'installation des éléments nécessaires au projet :
```bash
npm install
```

### 4. Connecter vos services (Base de données & IA)
Dans le dossier `all-model-chat`, créez un fichier nommé `.env.local` et collez-y vos liens et mots de passe secrets :
```env
VITE_SUPABASE_URL=votre_lien_supabase_ici
VITE_SUPABASE_ANON_KEY=votre_cle_supabase_ici
VITE_GEMINI_API_KEY=votre_cle_intelligence_artificielle_ici
```

*Note : Pour que tout fonctionne, n'oubliez pas de configurer votre base de données Supabase en copiant/collant le texte de notre fichier `supabase_schema.sql` dans l'éditeur SQL de votre tableau de bord Supabase.*

### 5. Démarrer l'application !
Il ne vous reste plus qu'à lancer le site avec cette commande :
```bash
npm run dev
```
🎉 Et voilà ! Ouvrez votre navigateur internet et tapez l'adresse indiquée dans la console (généralement `http://localhost:5173`) pour découvrir EVOLUTICS.

---

## 👥 L'équipe (HACKBYIFRI 2026)

- **Shadrak BESSANH**
- **Marlyse BOUKARI**
- **Othniel AGUIDI**

<div align="center">
  <br/>
  <p>Fait avec ❤️ par l'équipe EVOLUTICS</p>
</div>
