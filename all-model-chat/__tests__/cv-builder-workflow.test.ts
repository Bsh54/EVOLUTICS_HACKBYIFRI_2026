// Test du workflow CV Builder - EVOLUTICS
// Ce fichier teste la logique de navigation et les composants

import { CVData } from '../types/cvTypes';

// Test des données par défaut
const testCVData: CVData = {
  fullName: "Jean Dupont",
  title: "Développeur Full Stack",
  color: "#00a99d",
  profileImage: "",
  contact: {
    phone: "+33 6 12 34 56 78",
    email: "jean.dupont@email.com",
    address: "Paris, France",
    linkedin: "linkedin.com/in/jeandupont"
  },
  about: "Développeur passionné avec 3 ans d'expérience en React et Node.js",
  objective: "",
  experiences: [
    {
      role: "Développeur Frontend",
      company: "TechCorp",
      startDate: "2023",
      endDate: "Présent",
      isCurrent: true,
      description: "Développement d'applications React avec TypeScript"
    }
  ],
  education: [
    {
      degree: "Master Informatique",
      school: "Université Paris",
      startDate: "2020",
      endDate: "2022",
      isCurrent: false
    }
  ],
  certifications: [],
  skills: [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 }
  ],
  tools: [],
  links: [],
  languages: ["Français (Natif)", "Anglais (Courant)"],
  hobbies: ["Programmation", "Lecture", "Sport"],
  references: [
    {
      name: "Marie Martin",
      contact: "marie.martin@techcorp.com - Manager"
    }
  ],
  strategicPitch: "",
  isOptimized: false,
  sectionsOrder: {
    sidebar: ["contact", "skills", "languages", "hobbies"],
    main: ["about", "experiences", "education", "references"]
  }
};

// Test des templates disponibles
const availableTemplates = [
  {
    id: 'moderne-01',
    name: 'Moderne Professionnel',
    isAvailable: true
  },
  {
    id: 'classique-01',
    name: 'Classique Élégant',
    isAvailable: false
  },
  {
    id: 'creatif-01',
    name: 'Créatif Dynamique',
    isAvailable: false
  }
];

// Test du workflow
console.log('🧪 Test du workflow CV Builder EVOLUTICS');
console.log('✅ Données CV de test:', testCVData);
console.log('✅ Templates disponibles:', availableTemplates);
console.log('✅ Template actif:', availableTemplates.filter(t => t.isAvailable));

// Simulation du workflow
console.log('\n📋 Workflow CV Builder:');
console.log('1. 🛠️  Clic sur carte "Création de CV" dans ToolsPage');
console.log('2. 📄  Sélection template dans CVTemplateSelector');
console.log('3. ✏️  Remplissage formulaire dans CVBuilderPage');
console.log('4. 👁️  Prévisualisation et export PDF');

export { testCVData, availableTemplates };