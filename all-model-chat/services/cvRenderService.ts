import { CVData } from '../types/cvTypes';

/**
 * Service de rendu HTML pour génération PDF
 * Inspiré de mon-cv-local-main pour une meilleure qualité PDF
 */
export class CVRenderService {

  /**
   * Tronque intelligemment le texte pour éviter l'overflow
   */
  private static truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;

    // Trouve le dernier espace avant la limite pour éviter de couper un mot
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.8) { // Si l'espace est assez proche de la fin
      return text.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  /**
   * Optimise les données CV pour tenir sur une seule page
   */
  private static optimizeForSinglePage(cvData: CVData): CVData {
    const optimized = { ...cvData };

    // Limiter la description "À propos"
    if (optimized.about) {
      optimized.about = this.truncateText(optimized.about, 300);
    }

    // Limiter les descriptions d'expériences
    if (optimized.experiences) {
      optimized.experiences = optimized.experiences.map(exp => ({
        ...exp,
        description: exp.description ? this.truncateText(exp.description, 200) : exp.description
      }));
    }

    // Limiter le nombre d'expériences si trop nombreuses
    if (optimized.experiences && optimized.experiences.length > 4) {
      optimized.experiences = optimized.experiences.slice(0, 4);
    }

    // Limiter le nombre de compétences
    if (optimized.skills && optimized.skills.length > 12) {
      optimized.skills = optimized.skills.slice(0, 12);
    }

    // Limiter les langues et loisirs
    if (optimized.languages && optimized.languages.length > 6) {
      optimized.languages = optimized.languages.slice(0, 6);
    }

    if (optimized.hobbies && optimized.hobbies.length > 6) {
      optimized.hobbies = optimized.hobbies.slice(0, 6);
    }

    // Limiter les références
    if (optimized.references && optimized.references.length > 2) {
      optimized.references = optimized.references.slice(0, 2);
    }

    return optimized;
  }

  /**
   * Génère le HTML optimisé pour PDF à partir des données CV
   */
  static renderCVToHTML(cvData: CVData): string {
    // Optimiser automatiquement les données pour tenir sur une seule page
    const optimizedData = this.optimizeForSinglePage(cvData);
    const primaryColor = optimizedData.color || "#3b82f6";

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${optimizedData.fullName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', Arial, sans-serif;
      color: #1e293b;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cv-container {
      width: 794px;
      min-height: 1122px;
      max-height: 1122px;
      background: white;
      display: flex;
      border: 12px solid ${primaryColor};
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .sidebar {
      width: 38%;
      background: #f0f7f7;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }

    .main-content {
      width: 62%;
      padding: 30px 24px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }

    h1 {
      font-size: 26px;
      font-weight: 900;
      margin-bottom: 6px;
      color: #0f172a;
      line-height: 1.1;
    }

    .title {
      font-size: 11px;
      font-weight: 700;
      color: ${primaryColor};
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
    }

    .profile-image {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      object-fit: cover;
      margin: 0 auto 24px auto;
      display: block;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 12px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title::before {
      content: '';
      width: 24px;
      height: 24px;
      background: ${primaryColor};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .main-section-title {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 6px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 10px;
      color: #475569;
    }

    .contact-icon {
      width: 12px;
      height: 12px;
      color: #94a3b8;
    }

    .experience-item {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }

    .experience-role {
      font-size: 10px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .experience-dates {
      font-size: 9px;
      font-weight: 700;
      color: #94a3b8;
      font-style: italic;
    }

    .experience-company {
      font-size: 9px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 6px;
    }

    .experience-description {
      font-size: 9px;
      line-height: 1.4;
      color: #64748b;
      white-space: pre-line;
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .about-text {
      font-size: 10px;
      line-height: 1.5;
      color: #475569;
      font-weight: 500;
      max-height: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .education-item {
      margin-bottom: 12px;
    }

    .education-degree {
      font-size: 10px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .education-school {
      font-size: 9px;
      color: #64748b;
      font-weight: 700;
      font-style: italic;
    }

    .education-dates {
      font-size: 8px;
      color: #94a3b8;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 30px;
    }

    .skill-item {
      margin-bottom: 10px;
    }

    .skill-name {
      font-size: 9px;
      font-weight: 700;
      color: #374151;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .skill-bar {
      height: 5px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
    }

    .skill-progress {
      height: 100%;
      background: ${primaryColor};
      border-radius: 2px;
      transition: width 1s ease;
    }

    .languages-hobbies {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }

    .list-bullet {
      width: 4px;
      height: 4px;
      background: ${primaryColor};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .list-text {
      font-size: 9px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .references-item {
      margin-bottom: 12px;
    }

    .reference-name {
      font-size: 10px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .reference-contact {
      font-size: 9px;
      color: #64748b;
      line-height: 1.3;
      white-space: pre-line;
      max-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media print {
      .cv-container {
        width: 794px !important;
        height: 1122px !important;
        max-height: 1122px !important;
        overflow: hidden !important;
      }
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="sidebar">
      <h1>${optimizedData.fullName}</h1>
      <p class="title">${optimizedData.title}</p>

      ${optimizedData.profileImage ? `<img src="${optimizedData.profileImage}" class="profile-image" alt="Photo de profil" />` : ''}

      <div class="section">
        <div class="section-title">CONTACT</div>
        <div class="contact-item">
          <span class="contact-icon">📞</span>
          <span>${optimizedData.contact.phone}</span>
        </div>
        <div class="contact-item">
          <span class="contact-icon">✉️</span>
          <span>${optimizedData.contact.email}</span>
        </div>
        <div class="contact-item">
          <span class="contact-icon">📍</span>
          <span>${optimizedData.contact.address}</span>
        </div>
      </div>

      ${optimizedData.education && optimizedData.education.length > 0 ? `
      <div class="section">
        <div class="section-title">FORMATION</div>
        ${optimizedData.education.map(edu => `
          <div class="education-item">
            <div class="education-degree">${edu.degree}</div>
            <div class="education-school">${edu.school}</div>
            <div class="education-dates">${edu.startDate} - ${edu.endDate}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${optimizedData.references && optimizedData.references.length > 0 ? `
      <div class="section">
        <div class="section-title">RÉFÉRENCES</div>
        ${optimizedData.references.map(ref => `
          <div class="references-item">
            <div class="reference-name">${ref.name}</div>
            <div class="reference-contact">${ref.contact}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <div class="main-content">
      <div class="section">
        <div class="section-title main-section-title">À PROPOS</div>
        <p class="about-text">${optimizedData.about}</p>
      </div>

      <div class="section">
        <div class="section-title main-section-title">EXPÉRIENCE PROFESSIONNELLE</div>
        ${optimizedData.experiences.map(exp => `
          <div class="experience-item">
            <div class="experience-header">
              <div class="experience-role">${exp.role}</div>
              <div class="experience-dates">${exp.startDate} - ${exp.endDate || 'Présent'}</div>
            </div>
            <div class="experience-company">${exp.company}</div>
            ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
          </div>
        `).join('')}
      </div>

      ${optimizedData.skills && optimizedData.skills.length > 0 ? `
      <div class="section">
        <div class="section-title main-section-title">COMPÉTENCES</div>
        <div class="skills-grid">
          ${optimizedData.skills.map(skill => `
            <div class="skill-item">
              <div class="skill-name">${skill.name}</div>
              <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="languages-hobbies">
        ${optimizedData.languages && optimizedData.languages.length > 0 ? `
        <div class="section">
          <div class="section-title">LANGUES</div>
          ${optimizedData.languages.filter(l => l.trim()).map(lang => `
            <div class="list-item">
              <div class="list-bullet"></div>
              <span class="list-text">${lang}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${optimizedData.hobbies && optimizedData.hobbies.length > 0 ? `
        <div class="section">
          <div class="section-title">LOISIRS</div>
          ${optimizedData.hobbies.filter(h => h.trim()).map(hobby => `
            <div class="list-item">
              <div class="list-bullet"></div>
              <span class="list-text">${hobby}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Génère un nom de fichier sécurisé pour le PDF
   */
  static generatePDFFilename(fullName: string): string {
    const cleanName = fullName
      .replace(/[^a-zA-Z0-9\s]/g, '') // Supprimer caractères spéciaux
      .replace(/\s+/g, '_') // Remplacer espaces par underscores
      .substring(0, 50); // Limiter la longueur

    return `CV_${cleanName}_EVOLUTICS.pdf`;
  }
}

export default CVRenderService;