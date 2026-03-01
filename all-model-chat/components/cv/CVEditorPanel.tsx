import React, { useState, useRef } from "react";
import { Trash2, X, ImageIcon } from "lucide-react";
import type { CVData } from "../../types/cvTypes";

interface CVEditorPanelProps {
  data: CVData;
  onChange: (newData: CVData) => void;
}

const CVEditorPanel: React.FC<CVEditorPanelProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof CVData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleNestedChange = (parent: keyof CVData, field: string, value: string) => {
    onChange({
      ...data,
      [parent]: { ...data[parent as keyof CVData] as any, [field]: value },
    });
  };

  const addItem = (field: keyof CVData, item: any) => {
    const list = (data[field] as any[]) || [];
    onChange({ ...data, [field]: [...list, item] });
  };

  const updateItem = (field: keyof CVData, index: number, key: string | null, value: any) => {
    const list = [...(data[field] as any[])];
    if (key) list[index] = { ...list[index], [key]: value };
    else list[index] = value;
    onChange({ ...data, [field]: list });
  };

  const removeItem = (field: keyof CVData, index: number) => {
    const list = [...(data[field] as any[])];
    list.splice(index, 1);
    onChange({ ...data, [field]: list });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleChange("profileImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Accordéon simplifié pour EVOLUTICS */}
      <div className="space-y-6">

        {/* 1. INFOS & PHOTO */}
        <div className="bg-[var(--theme-bg-primary)] p-4 rounded-lg border border-[var(--theme-border-primary)]">
          <h3 className="font-bold text-[var(--theme-text-primary)] mb-4">1. État Civil & Photo</h3>

          <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-xl bg-[var(--theme-bg-secondary)] mb-4">
            {data.profileImage ? (
              <div className="relative">
                <img src={data.profileImage} className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md" alt="Profil" />
                <button onClick={() => handleChange("profileImage", "")} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md">
                  <X className="w-3 h-3"/>
                </button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center text-[var(--theme-text-tertiary)] hover:text-[var(--theme-bg-accent)] transition-colors">
                <ImageIcon className="w-10 h-10 mb-2" />
                <span className="text-xs font-bold uppercase">Ajouter une photo</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Nom Complet</label>
              <input
                className="w-full border border-[var(--theme-border-primary)] rounded-md px-3 py-2 text-sm bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]"
                value={data.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Titre du poste</label>
              <input
                className="w-full border border-[var(--theme-border-primary)] rounded-md px-3 py-2 text-sm bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]"
                value={data.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Email</label>
              <input
                className="w-full border border-[var(--theme-border-primary)] rounded-md px-3 py-2 text-sm bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]"
                value={data.contact.email}
                onChange={(e) => handleNestedChange("contact", "email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Téléphone</label>
              <input
                className="w-full border border-[var(--theme-border-primary)] rounded-md px-3 py-2 text-sm bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]"
                value={data.contact.phone}
                onChange={(e) => handleNestedChange("contact", "phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Adresse</label>
              <input
                className="w-full border border-[var(--theme-border-primary)] rounded-md px-3 py-2 text-sm bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]"
                value={data.contact.address}
                onChange={(e) => handleNestedChange("contact", "address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Profil / Résumé</label>
              <textarea
                className="w-full border border-[var(--theme-border-primary)] rounded px-3 py-2 text-sm h-20 outline-none focus:border-[var(--theme-bg-accent)] bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]"
                value={data.about}
                onChange={(e) => handleChange("about", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2. EXPÉRIENCES */}
        <div className="bg-[var(--theme-bg-primary)] p-4 rounded-lg border border-[var(--theme-border-primary)]">
          <h3 className="font-bold text-[var(--theme-text-primary)] mb-4">2. Expériences Professionnelles</h3>

          <div className="space-y-4">
            {data.experiences.map((exp, i) => (
              <div key={i} className="border border-[var(--theme-border-primary)] p-4 rounded-lg bg-[var(--theme-bg-secondary)] space-y-3 relative group">
                <button onClick={() => removeItem("experiences", i)} className="absolute top-2 right-2 text-[var(--theme-text-tertiary)] hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <input
                  placeholder="Poste"
                  className="w-full bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded px-3 py-2 text-sm font-bold outline-none text-[var(--theme-text-primary)]"
                  value={exp.role}
                  onChange={(e) => updateItem("experiences", i, "role", e.target.value)}
                />
                <input
                  placeholder="Entreprise / Lieu"
                  className="w-full bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded px-3 py-2 text-xs outline-none text-[var(--theme-text-primary)]"
                  value={exp.company}
                  onChange={(e) => updateItem("experiences", i, "company", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Début (ex: 2020)"
                    className="w-full bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded px-3 py-2 text-xs outline-none text-[var(--theme-text-primary)]"
                    value={exp.startDate}
                    onChange={(e) => updateItem("experiences", i, "startDate", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Fin (ex: Présent)"
                    className="w-full bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded px-3 py-2 text-xs outline-none text-[var(--theme-text-primary)]"
                    value={exp.endDate}
                    onChange={(e) => updateItem("experiences", i, "endDate", e.target.value)}
                  />
                </div>
                <textarea
                  placeholder="Missions et réalisations..."
                  className="w-full text-xs border border-[var(--theme-border-primary)] rounded p-2 h-20 outline-none bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]"
                  value={exp.description}
                  onChange={(e) => updateItem("experiences", i, "description", e.target.value)}
                />
              </div>
            ))}
            <button
              className="w-full border-2 border-dashed border-[var(--theme-border-primary)] rounded-lg py-3 text-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent)]/10 transition-colors font-medium"
              onClick={() => addItem("experiences", { role: "", company: "", startDate: "", endDate: "", isCurrent: true, description: "" })}
            >
              + Ajouter Expérience
            </button>
          </div>
        </div>

        {/* 3. AUTRES RUBRIQUES */}
        <div className="bg-[var(--theme-bg-primary)] p-4 rounded-lg border border-[var(--theme-border-primary)]">
          <h3 className="font-bold text-[var(--theme-text-primary)] mb-4">3. Autres rubriques</h3>

          <div className="space-y-6">
            {/* FORMATION */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-[var(--theme-bg-accent)]">Formation</label>
              {data.education.map((edu, i) => (
                <div key={i} className="flex gap-2 items-center bg-[var(--theme-bg-secondary)] p-2 border border-[var(--theme-border-primary)] rounded">
                  <input
                    className="flex-1 text-xs outline-none bg-transparent text-[var(--theme-text-primary)]"
                    placeholder="Diplôme / École"
                    value={edu.degree}
                    onChange={(e) => updateItem("education", i, "degree", e.target.value)}
                  />
                  <button onClick={() => removeItem("education", i)}>
                    <X className="w-3 h-3 text-red-400"/>
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem("education", { degree: "", school: "", startDate: "", endDate: "", isCurrent: false })}
                className="text-xs font-bold text-[var(--theme-bg-accent)] hover:underline"
              >
                + Ajouter Diplôme
              </button>
            </div>

            {/* COMPÉTENCES */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-[var(--theme-bg-accent)]">Compétences (%)</label>
              {data.skills.map((s, i) => (
                <div key={i} className="flex gap-2 items-center bg-[var(--theme-bg-secondary)] p-2 border border-[var(--theme-border-primary)] rounded">
                  <input
                    className="flex-1 text-xs outline-none bg-transparent text-[var(--theme-text-primary)]"
                    value={s.name}
                    onChange={(e) => updateItem("skills", i, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-12 text-xs text-center bg-transparent text-[var(--theme-text-primary)]"
                    value={s.level}
                    onChange={(e) => updateItem("skills", i, "level", parseInt(e.target.value))}
                  />
                  <button onClick={() => removeItem("skills", i)}>
                    <X className="w-3 h-3 text-red-400"/>
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem("skills", { name: "", level: 80 })}
                className="text-xs font-bold text-[var(--theme-bg-accent)] hover:underline"
              >
                + Ajouter Compétence
              </button>
            </div>

            {/* LANGUES & LOISIRS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--theme-text-secondary)]">Langues</label>
                <textarea
                  className="w-full border border-[var(--theme-border-primary)] rounded text-xs p-2 h-16 outline-none bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]"
                  placeholder="Une langue par ligne"
                  value={data.languages.join("\n")}
                  onChange={(e) => handleChange("languages", e.target.value.split("\n"))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--theme-text-secondary)]">Loisirs</label>
                <textarea
                  className="w-full border border-[var(--theme-border-primary)] rounded text-xs p-2 h-16 outline-none bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]"
                  placeholder="Un loisir par ligne"
                  value={data.hobbies.join("\n")}
                  onChange={(e) => handleChange("hobbies", e.target.value.split("\n"))}
                />
              </div>
            </div>

            {/* RÉFÉRENCES */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-[var(--theme-bg-accent)]">Références</label>
              {data.references.map((ref, i) => (
                <div key={i} className="space-y-2 p-3 border border-[var(--theme-border-primary)] rounded bg-[var(--theme-bg-secondary)] relative group">
                  <button onClick={() => removeItem("references", i)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3"/>
                  </button>
                  <input
                    className="w-full text-xs font-bold outline-none bg-transparent text-[var(--theme-text-primary)]"
                    placeholder="Nom du référent"
                    value={ref.name}
                    onChange={(e) => updateItem("references", i, "name", e.target.value)}
                  />
                  <input
                    className="w-full text-xs outline-none text-[var(--theme-text-secondary)] bg-transparent"
                    placeholder="Poste / Contact"
                    value={ref.contact}
                    onChange={(e) => updateItem("references", i, "contact", e.target.value)}
                  />
                </div>
              ))}
              <button
                onClick={() => addItem("references", { name: "", contact: "" })}
                className="text-xs font-bold text-[var(--theme-bg-accent)] hover:underline"
              >
                + Ajouter Référence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEditorPanel;