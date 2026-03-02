import { CVData } from '../types/cvTypes';

/**
 * Service de rendu HTML pour génération PDF
 * Inspiré de mon-cv-local-main pour une meilleure qualité PDF
 */
export class CVRenderService {

  /**
   * Génère le HTML optimisé pour PDF à partir des données CV
   */
  static renderCVToHTML(cvData: CVData): string {
    const primaryColor = cvData.color || "#3b82f6";

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cvData.fullName}</title>
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
      background: white;
      display: flex;
      border: 12px solid ${primaryColor};
      position: relative;
    }

    .sidebar {
      width: 38%;
      background: #f0f7f7;
      padding: 32px;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      width: 62%;
      padding: 40px;
      display: flex;
      flex-direction: column;
    }

    h1 {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 8px;
      color: #0f172a;
      line-height: 1.2;
    }

    .title {
      font-size: 12px;
      font-weight: 700;
      color: ${primaryColor};
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
    }

    .profile-image {
      width: 176px;
      height: 176px;
      border-radius: 50%;
      border: 6px solid white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      object-fit: cover;
      margin: 0 auto 32px auto;
      display: block;
    }

    .section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 16px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-title::before {
      content: '';
      width: 32px;
      height: 32px;
      background: ${primaryColor};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .main-section-title {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 11px;
      color: #475569;
    }

    .contact-icon {
      width: 14px;
      height: 14px;
      color: #94a3b8;
    }

    .experience-item {
      margin-bottom: 24px;
      page-break-inside: avoid;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .experience-role {
      font-size: 11px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
    }

    .experience-dates {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      font-style: italic;
    }

    .experience-company {
      font-size: 10px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 8px;
    }

    .experience-description {
      font-size: 10px;
      line-height: 1.6;
      color: #64748b;
      white-space: pre-line;
    }

    .about-text {
      font-size: 11px;
      line-height: 1.6;
      color: #475569;
      font-weight: 500;
    }

    .education-item {
      margin-bottom: 16px;
    }

    .education-degree {
      font-size: 11px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
    }

    .education-school {
      font-size: 10px;
      color: #64748b;
      font-weight: 700;
      font-style: italic;
    }

    .education-dates {
      font-size: 9px;
      color: #94a3b8;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 40px;
    }

    .skill-item {
      margin-bottom: 12px;
    }

    .skill-name {
      font-size: 10px;
      font-weight: 700;
      color: #374151;
      margin-bottom: 6px;
    }

    .skill-bar {
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }

    .skill-progress {
      height: 100%;
      background: ${primaryColor};
      border-radius: 3px;
      transition: width 1s ease;
    }

    .languages-hobbies {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .list-bullet {
      width: 6px;
      height: 6px;
      background: ${primaryColor};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .list-text {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .references-item {
      margin-bottom: 16px;
    }

    .reference-name {
      font-size: 11px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
    }

    .reference-contact {
      font-size: 10px;
      color: #64748b;
      line-height: 1.5;
      white-space: pre-line;
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
      <h1>${cvData.fullName}</h1>
      <p class="title">${cvData.title}</p>

      ${cvData.profileImage ? `<img src="${cvData.profileImage}" class="profile-image" alt="Photo de profil" />` : ''}

      <div class="section">
        <div class="section-title">CONTACT</div>
        <div class="contact-item">
          <span class="contact-icon">📞</span>
          <span>${cvData.contact.phone}</span>
        </div>
        <div class="contact-item">
          <span class="contact-icon">✉️</span>
          <span>${cvData.contact.email}</span>
        </div>
        <div class="contact-item">
          <span class="contact-icon">📍</span>
          <span>${cvData.contact.address}</span>
        </div>
      </div>

      ${cvData.education && cvData.education.length > 0 ? `
      <div class="section">
        <div class="section-title">FORMATION</div>
        ${cvData.education.map(edu => `
          <div class="education-item">
            <div class="education-degree">${edu.degree}</div>
            <div class="education-school">${edu.school}</div>
            <div class="education-dates">${edu.startDate} - ${edu.endDate}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${cvData.references && cvData.references.length > 0 ? `
      <div class="section">
        <div class="section-title">RÉFÉRENCES</div>
        ${cvData.references.map(ref => `
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
        <p class="about-text">${cvData.about}</p>
      </div>

      <div class="section">
        <div class="section-title main-section-title">EXPÉRIENCE PROFESSIONNELLE</div>
        ${cvData.experiences.map(exp => `
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

      ${cvData.skills && cvData.skills.length > 0 ? `
      <div class="section">
        <div class="section-title main-section-title">COMPÉTENCES</div>
        <div class="skills-grid">
          ${cvData.skills.map(skill => `
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
        ${cvData.languages && cvData.languages.length > 0 ? `
        <div class="section">
          <div class="section-title">LANGUES</div>
          ${cvData.languages.filter(l => l.trim()).map(lang => `
            <div class="list-item">
              <div class="list-bullet"></div>
              <span class="list-text">${lang}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${cvData.hobbies && cvData.hobbies.length > 0 ? `
        <div class="section">
          <div class="section-title">LOISIRS</div>
          ${cvData.hobbies.filter(h => h.trim()).map(hobby => `
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