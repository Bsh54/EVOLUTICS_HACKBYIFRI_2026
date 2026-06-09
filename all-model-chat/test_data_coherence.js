// Test de cohérence des données CV ↔ Profil
console.log('🧪 Test de cohérence des données');

// Simulation des données
const profileData = {
  id: "test-user",
  display_name: "Shadrak BESSANH",
  email: "bshnewsletterfornews@gmail.com",
  phone: "+2290197426540",
  bio: "Décrivez votre profil professionnel ici...",
  current_position: "Votre Titre Professionnel",
  skills: ["SQL", "Python"],
  university: "Université Paris Tech"
};

// Données CV avec seulement le nom modifié (sauvegarde sélective)
const filteredCVData = {
  fullName: "Shadrak BESSANH", // ✅ Modifié
  title: "", // ❌ Vide car pas modifié
  contact: {
    email: "", // ❌ Vide car pas modifié
    phone: "", // ❌ Vide car pas modifié
  },
  skills: [], // ❌ Vide car pas modifié
  // ... autres champs vides
};

// Données CV complètes (affichage avec merge)
const displayCVData = {
  fullName: "Shadrak BESSANH", // ✅ Données réelles
  title: "Votre Titre Professionnel", // ⚠️ Données de test
  contact: {
    email: "bshnewsletterfornews@gmail.com", // ✅ Données réelles du profil
    phone: "+2290197426540", // ✅ Données réelles du profil
  },
  skills: [{name: "SQL", level: 80}, {name: "Python", level: 80}], // ✅ Données réelles du profil
};

console.log('📊 Analyse des incohérences potentielles:');
console.log('1. Données filtrées sauvées:', filteredCVData);
console.log('2. Données affichées (mergées):', displayCVData);
console.log('3. Profil source:', profileData);

console.log('⚠️ PROBLÈMES IDENTIFIÉS:');
console.log('- syncCVToProfile reçoit des données filtrées (vides)');
console.log('- Le profil pourrait être écrasé avec des valeurs vides');
console.log('- Perte de cohérence entre CV affiché et profil sauvé');