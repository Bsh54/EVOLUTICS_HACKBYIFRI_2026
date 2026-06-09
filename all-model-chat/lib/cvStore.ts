import type { CVData } from "../types/cvTypes";

// Stockage uniquement en mémoire vive (RAM) - exactement comme CV-AI
// S'efface au rechargement de la page (F5)
let currentCVData: CVData | null = null;

export const getCVData = () => currentCVData;
export const setCVData = (data: CVData) => {
  currentCVData = data;
};

export const clearCVData = () => {
  currentCVData = null;
};