# 📋 Cahier des Charges - Projet EVOLUTICS

## HACKBYIFRI 2026 : Intégration Efficace du Numérique dans l'Apprentissage








---

## 1.  Présentation du Projet

**EVOLUTICS** est une plateforme numérique innovante conçue pour répondre aux défis d'insertion professionnelle et d'inclusion financière des étudiants.

Dans le cadre du Hackathon **HACKBYIFRI 2026**, ce projet s'inscrit directement dans les axes prioritaires :
- **Axe 6** : Orientation académique & insertion professionnelle
- **Axe 3** : Inclusion financière & autonomie économique

La solution combine deux composantes essentielles :
- Un **Hub d'Opportunités** centralisé
- Un **Assistant IA Contextuel** (Coach Carrière)

L'objectif est d'accompagner l'étudiant de la découverte de l'offre jusqu'à la préparation à l'entretien.

---

## 2.  Objectifs 

### 2.1 Problématique

Les étudiants font face à plusieurs défis majeurs :
- **Manque de visibilité** sur les opportunités disponibles (stages, bourses, emplois)
- **Information dispersée** sur différentes plateformes
- **Accompagnement personnalisé insuffisant** pour postuler efficacement
- **Aide générique** pour la rédaction de CV et lettres de motivation

### 2.2 Solution Apportée

EVOLUTICS propose une approche innovante en deux temps :

1. **Centraliser** 
   - Agrégation des offres d'emploi, stages, bourses et concours en une seule plateforme

2. **Coacher** 
   - Utilisation de l'IA  pour analyser spécifiquement chaque offre
   - Fourniture de conseils sur-mesure, adaptés au contexte réel de l'offre

---

## 3.  Spécifications Fonctionnelles

| Module | Fonctionnalité | Description |
|--------|----------------|-------------|
| **Hub Étudiant** | Exploration | Liste des offres sous forme de cartes enrichies avec système de filtres (Type, Favoris) |
| **Hub Étudiant** | Détail Offre | Vue immersive complet et indicateurs visuels |
| **IA Coach** | Contextualisation | L'IA reçoit automatiquement le contenu de l'offre active pour des conseils pertinents |
| **IA Coach** | Assistance | Aide à la rédaction, simulation d'entretien, conseils stratégiques personnalisés |
| **Admin Portal** | Gestion (CRUD) | Interface intuitive pour créer, modifier et supprimer des opportunités sans compétences techniques |
| **Admin Portal** | IA Générative | Génération automatique de messages d'accueil engageants pour chaque opportunité |

---

## 4.  Architecture Technique

### 4.1 Stack Technologique

Le projet repose sur une architecture moderne, performante et optimisée pour le déploiement serverless :

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | React 18 + Vite (TypeScript) |
| **Styling** | Tailwind CSS (Approche Mobile-First) |
| **Intelligence Artificielle** | Google Gemini 2.5 Flash  |
| **Persistance Données** | LocalStorage (Offres) + IndexedDB (Historique Chat) |
| **Déploiement** | Compatible Vercel / Netlify /  |

### 4.2 Flux de Données IA

L'architecture IA est optimisée pour garantir une expérience contextuelle :

1. **Sélection** 
   - L'utilisateur sélectionne une offre spécifique

2. **Injection** 
   - Le système injecte automatiquement le contenu de l'offre dans le "System Prompt" de l'IA

3. **Contextualisation** 
   - L'IA agit comme un expert spécifique à cette offre (ex: Recruteur Senior dans le domaine concerné)

4. **Interaction** 
   - Les échanges sont streamés en temps réel pour une expérience utilisateur fluide

---



## 5.  Conclusion et Impact

**EVOLUTICS** représente une réponse concrète et opérationnelle aux besoins des étudiants béninois.

### Valeur Ajoutée

 **Démocratisation** de l'accès à un "Coach Carrière" personnel via l'IA  
 **Centralisation** des opportunités professionnelles et académiques  
 **Personnalisation** des conseils basés sur le contexte réel des offres  
 **Autonomisation** des candidats dans leur recherche d'opportunités

### Impact Visé

Ce projet démontre comment le numérique peut s'intégrer efficacement dans le parcours d'apprentissage et d'insertion professionnelle, en ne se contentant pas de lister des offres, mais en donnant aux candidats **les moyens de les décrocher**.

---

